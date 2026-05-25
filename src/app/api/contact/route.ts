import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/schema";
import { ContactSchema } from "@/lib/tracking-schema";
import {
  buildUserExtrasFromName,
  parseRequestContext,
  sendGA4Event,
  sendGoogleAdsConversion,
} from "@/lib/tracking-server";

export const runtime = "nodejs";

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

function syntheticEmail(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `lead-${digits}@noemail.luizfernando.adv.br`;
}

function readLeadValue(): { value: number; currency: string } {
  const v = Number(process.env.NEXT_PUBLIC_LEAD_VALUE);
  const value = Number.isFinite(v) && v >= 0 ? v : 1000;
  const currency = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? "BRL";
  return { value, currency };
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

  const context = parseRequestContext(req);
  const gclid = input.gclid ?? context.gclid;
  const wbraid = input.wbraid ?? context.wbraid;
  const gbraid = input.gbraid ?? context.gbraid;
  const gaClientId = input.ga_client_id ?? context.gaClientId;
  const gaSessionId = input.ga_session_id ?? context.gaSessionId;

  const orgId = process.env.ORGANIZATION_ID;

  let leadId: string;
  if (orgId && process.env.DATABASE_URL) {
    try {
      const [row] = await withTimeout(
        getDb()
          .insert(leads)
          .values({
            name: input.name,
            email,
            whatsapp: input.whatsapp,
            organization_id: orgId,
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

  const userExtras = buildUserExtrasFromName(
    input.name,
    email,
    input.whatsapp,
  );
  const { value, currency } = readLeadValue();
  const trackingContext = {
    ...context,
    gclid,
    wbraid,
    gbraid,
    gaClientId,
    gaSessionId,
  };

  void Promise.allSettled([
    sendGA4Event({
      eventName: "generate_lead",
      clientId: gaClientId,
      sessionId: gaSessionId,
      userAgent: context.userAgent,
      transactionId: leadId,
      value,
      currency,
      params: {
        lead_source: input.modelo ? `modelo-${input.modelo}` : "default",
        event_id: input.event_id,
      },
    }),
    sendGoogleAdsConversion({
      context: trackingContext,
      userExtras,
      orderId: leadId,
      conversionValue: value,
      currency,
    }),
  ]);

  return NextResponse.json({ success: true, leadId }, { status: 200 });
}
