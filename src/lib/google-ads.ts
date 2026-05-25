export type UserIdentifier =
  | { hashedEmail: string }
  | { hashedPhoneNumber: string }
  | {
      addressInfo: {
        hashedFirstName?: string;
        hashedLastName?: string;
        countryCode?: string;
      };
    };

export interface UploadClickConversionInput {
  conversionAction: string;
  orderId: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  conversionDateTime: string;
  conversionValue: number;
  currencyCode: string;
  userIdentifiers: UserIdentifier[];
  userAgent?: string;
  validateOnly?: boolean;
}

export interface ClickConversion {
  conversionAction: string;
  conversionDateTime: string;
  conversionValue: number;
  currencyCode: string;
  orderId: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  userIdentifiers: UserIdentifier[];
  userIdentifierSource?: "FIRST_PARTY";
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;
let inflightRefresh: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.error("[GADS] refresh_failed", r.status, txt);
      return null;
    }
    const json = (await r.json()) as {
      access_token: string;
      expires_in: number;
    };
    tokenCache = {
      accessToken: json.access_token,
      expiresAt: Date.now() + 50 * 60 * 1000,
    };
    return json.access_token;
  } catch (e) {
    console.error("[GADS] refresh_exception", e);
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }
  if (inflightRefresh) return inflightRefresh;
  inflightRefresh = doRefresh().finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
}

export function buildClickConversion(
  input: UploadClickConversionInput,
): ClickConversion {
  const conv: ClickConversion = {
    conversionAction: input.conversionAction,
    conversionDateTime: input.conversionDateTime,
    conversionValue: input.conversionValue,
    currencyCode: input.currencyCode,
    orderId: input.orderId,
    userIdentifiers: input.userIdentifiers,
    userIdentifierSource: "FIRST_PARTY",
  };
  if (input.gclid) conv.gclid = input.gclid;
  else if (input.wbraid) conv.wbraid = input.wbraid;
  else if (input.gbraid) conv.gbraid = input.gbraid;
  return conv;
}

export async function uploadClickConversion(
  input: UploadClickConversionInput,
): Promise<void> {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!customerId || !developerToken) {
    console.warn("[GADS] envs ausentes, pulando upload");
    return;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) return;

  const conversion = buildClickConversion(input);

  const payload: Record<string, unknown> = {
    conversions: [conversion],
    partialFailure: true,
    validateOnly: Boolean(input.validateOnly),
  };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": developerToken,
    "Content-Type": "application/json",
  };
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;

  const url = `https://googleads.googleapis.com/v18/customers/${customerId}:uploadClickConversions`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.error("[GADS] erro", r.status, txt);
      return;
    }
    const json = (await r.json()) as {
      partialFailureError?: { message?: string };
    };
    if (json.partialFailureError?.message) {
      console.error("[GADS] partial_failure", json.partialFailureError.message);
      return;
    }
    console.log("[GADS] OK", input.orderId);
  } catch (e) {
    console.error("[GADS] exception", e);
  }
}

export function buildConversionDateTimeBR(date: Date = new Date()): string {
  const tz = "America/Sao_Paulo";
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date).reduce<Record<string, string>>(
    (acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    },
    {},
  );
  const offset = getTimezoneOffsetString(date, tz);
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day} ${hour}:${parts.minute}:${parts.second}${offset}`;
}

function getTimezoneOffsetString(date: Date, timeZone: string): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  });
  const part = dtf
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  if (!part) return "+00:00";
  const m = part.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return "+00:00";
  const sign = m[1];
  const hh = m[2].padStart(2, "0");
  const mm = m[3] ?? "00";
  return `${sign}${hh}:${mm}`;
}
