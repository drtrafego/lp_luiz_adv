export interface CAPIPayload {
  leadId: string;
  name: string;
  email: string;
  whatsapp: string;
  modelo?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  eventSourceUrl?: string;
}

export interface GA4Payload {
  leadId: string;
  modelo?: string;
  clientId?: string;
  sessionId?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

export function parseGaClientId(cookieHeader: string): string | undefined {
  const match = cookieHeader.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/);
  return match ? match[1] : undefined;
}

export function parseGaSessionId(
  cookieHeader: string,
  measurementId: string,
): string | undefined {
  const containerId = measurementId.replace("G-", "");
  const match = cookieHeader.match(
    new RegExp(`(?:^|; )_ga_${containerId}=GS[^;]*?\\.(\\d+)\\.`),
  );
  return match ? match[1] : undefined;
}

async function sha256(raw: string): Promise<string> {
  const { createHash } = await import("crypto");
  return createHash("sha256").update(raw.trim().toLowerCase()).digest("hex");
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] ?? full;
}
function lastName(full: string) {
  const parts = full.trim().split(/\s+/);
  return parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
}
function cleanPhone(p: string) {
  return p.replace(/\D/g, "");
}

export async function sendMetaCAPI(p: CAPIPayload): Promise<void> {
  const pixelId = process.env.FB_PIXEL_ID;
  const token = process.env.FB_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  const [em, ph, fn, ln, country, externalId] = await Promise.all([
    sha256(p.email),
    sha256(cleanPhone(p.whatsapp)),
    sha256(firstName(p.name)),
    sha256(lastName(p.name)),
    sha256("br"),
    sha256(String(p.leadId)),
  ]);

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(p.leadId),
        action_source: "website",
        event_source_url: p.eventSourceUrl,
        user_data: {
          em: [em],
          ph: [ph],
          fn: [fn],
          ln: [ln],
          country: [country],
          client_ip_address: p.ip,
          client_user_agent: p.userAgent,
          fbc: p.fbc,
          fbp: p.fbp,
          external_id: [externalId],
        },
        custom_data: {
          content_name: "Lead Dr. Luiz Fernando",
          lead_type: p.modelo ? `modelo-${p.modelo}` : "default",
        },
      },
    ],
  };

  try {
    const r = await fetch(
      `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!r.ok) {
      const txt = await r.text();
      console.error("[CAPI] HTTP", r.status, txt);
    }
  } catch (e) {
    console.error("[CAPI] erro:", e);
  }
}

export async function sendGA4MP(p: GA4Payload): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const clientId = p.clientId ?? `server.${p.leadId}`;
  const body = {
    client_id: clientId,
    user_agent: p.userAgent,
    document_location: p.eventSourceUrl,
    events: [
      {
        name: "generate_lead",
        params: {
          currency: "BRL",
          lead_id: String(p.leadId),
          lead_source: p.modelo ? `modelo-${p.modelo}` : "default",
          session_id: p.sessionId,
          engagement_time_msec: 1,
        },
      },
    ],
  };

  try {
    const r = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!r.ok && r.status !== 204) {
      const txt = await r.text();
      console.error("[GA4 MP] HTTP", r.status, txt);
    }
  } catch (e) {
    console.error("[GA4 MP] erro:", e);
  }
}
