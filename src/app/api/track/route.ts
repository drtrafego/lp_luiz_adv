import { NextRequest, NextResponse } from "next/server";
import { TrackEventSchema } from "@/lib/tracking-schema";
import { parseRequestContext, sendGA4Event } from "@/lib/tracking-server";

export const runtime = "nodejs";

const EVENT_NAME_MAP: Record<string, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  Lead: "generate_lead",
  Contact: "contact",
};

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = TrackEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const context = parseRequestContext(req);
  const gaClientId = data.ga_client_id ?? context.gaClientId;
  const gaSessionId = data.ga_session_id ?? context.gaSessionId;

  const eventName = EVENT_NAME_MAP[data.event_name] ?? data.event_name;

  await sendGA4Event({
    eventName,
    clientId: gaClientId,
    sessionId: gaSessionId,
    userAgent: context.userAgent,
    transactionId: data.transaction_id,
    value: data.value,
    currency: data.currency,
    params: {
      event_id: data.event_id,
      page_path: data.page_path,
      lead_source: data.modelo ? `modelo-${data.modelo}` : undefined,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
