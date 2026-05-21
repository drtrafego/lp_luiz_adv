import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/schema";
import {
  parseGaClientId,
  parseGaSessionId,
  sendMetaCAPI,
  sendGA4MP,
} from "@/lib/tracking-server";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  whatsapp: z.string().min(10).max(20),
  email: z.string().email().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  modelo: z.string().optional(),
  ga_client_id: z.string().optional(),
  ga_session_id: z.string().optional(),
});

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  const m = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function syntheticEmail(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `lead-${digits}@noemail.luizfernando.adv.br`;
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    const json = await req.json();
    parsed = ContactSchema.safeParse(json);
  } catch {
    return NextResponse.json(
      { success: false, message: "JSON inválido" },
      { status: 400 },
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const input = parsed.data;
  const email = input.email ?? syntheticEmail(input.whatsapp);

  const cookieHeader = req.headers.get("cookie") ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const fbc = parseCookie(cookieHeader, "_fbc");
  const fbp = parseCookie(cookieHeader, "_fbp");
  const eventSourceUrl =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    undefined;
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID;
  const gaClientId =
    input.ga_client_id ?? parseGaClientId(cookieHeader) ?? undefined;
  const gaSessionId =
    input.ga_session_id ??
    (measurementId ? parseGaSessionId(cookieHeader, measurementId) : undefined);

  const orgId = process.env.ORGANIZATION_ID;
  const colId = process.env.DEFAULT_COLUMN_ID;

  let leadId: string;
  if (orgId && colId && process.env.DATABASE_URL) {
    try {
      const [row] = await withTimeout(
        getDb()
          .insert(leads)
          .values({
            name: input.name,
            email,
            whatsapp: input.whatsapp,
            organization_id: orgId,
            column_id: colId,
            utm_source: input.utm_source,
            utm_medium: input.utm_medium,
            utm_campaign: input.utm_campaign,
            utm_term: input.utm_term,
            utm_content: input.utm_content,
            campaign_source: input.utm_source,
            page_path: input.modelo ? `/${input.modelo}` : "/",
            status: "novo",
            position: Math.floor(Date.now() / 1000),
          })
          .returning({ id: leads.id }),
        5_000,
      );
      leadId = row.id;
    } catch (e) {
      console.error("[contact] banco indisponível:", e);
      leadId = `fallback_${Date.now()}`;
    }
  } else {
    console.warn("[contact] ENV incompleto, pulando insert no banco");
    leadId = `fallback_${Date.now()}`;
  }

  void Promise.all([
    sendMetaCAPI({
      leadId,
      name: input.name,
      email,
      whatsapp: input.whatsapp,
      modelo: input.modelo,
      ip,
      userAgent,
      fbc,
      fbp,
      eventSourceUrl,
    }),
    sendGA4MP({
      leadId,
      modelo: input.modelo,
      clientId: gaClientId,
      sessionId: gaSessionId,
      userAgent,
      eventSourceUrl,
    }),
  ]).catch((err) => console.error("[contact] tracking err:", err));

  return NextResponse.json({ success: true, leadId }, { status: 200 });
}
