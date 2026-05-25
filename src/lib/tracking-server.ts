import { createHash, randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import {
  buildConversionDateTimeBR,
  uploadClickConversion,
  type UserIdentifier,
} from "./google-ads";

export interface RequestContext {
  ip?: string;
  userAgent?: string;
  origin?: string;
  eventSourceUrl?: string;
  externalId: string;
  gaClientId?: string;
  gaSessionId?: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

export interface UserExtras {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface GA4EventInput {
  eventName: string;
  clientId?: string;
  sessionId?: string;
  userAgent?: string;
  transactionId?: string;
  value?: number;
  currency?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

function parseCookie(header: string, name: string): string | undefined {
  const m = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
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

function parseGclFromCookie(
  cookieHeader: string,
  name: string,
): string | undefined {
  const raw = parseCookie(cookieHeader, `_gcl_${name}`);
  if (!raw) return undefined;
  const m = raw.match(/^GCL\.\d+\.(.+)$/);
  return m ? m[1] : raw;
}

export function parseRequestContext(req: NextRequest): RequestContext {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const origin = req.headers.get("origin") ?? undefined;
  const referer = req.headers.get("referer") ?? undefined;
  const eventSourceUrl =
    referer ?? origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? undefined;

  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID;

  return {
    ip,
    userAgent,
    origin,
    eventSourceUrl,
    externalId: parseCookie(cookieHeader, "_eid") ?? randomUUID(),
    gaClientId: parseGaClientId(cookieHeader),
    gaSessionId: measurementId
      ? parseGaSessionId(cookieHeader, measurementId)
      : undefined,
    gclid: parseGclFromCookie(cookieHeader, "aw"),
    wbraid: parseGclFromCookie(cookieHeader, "wbraid"),
    gbraid: parseGclFromCookie(cookieHeader, "gbraid"),
    country: req.headers.get("x-vercel-ip-country") ?? undefined,
    city: req.headers.get("x-vercel-ip-city") ?? undefined,
    postalCode: req.headers.get("x-vercel-ip-postal-code") ?? undefined,
  };
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function normalizePhoneBR(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  if (
    (digits.length === 12 || digits.length === 13) &&
    digits.startsWith("55")
  ) {
    return `+${digits}`;
  }
  if (digits.startsWith("55")) return `+${digits}`;
  return `+${digits}`;
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { first, last };
}

export function buildUserIdentifiers(extras: UserExtras): UserIdentifier[] {
  const list: UserIdentifier[] = [];

  if (extras.email) {
    const norm = extras.email.trim().toLowerCase();
    list.push({ hashedEmail: sha256(norm) });
  }
  if (extras.phone) {
    const norm = normalizePhoneBR(extras.phone);
    list.push({ hashedPhoneNumber: sha256(norm) });
  }
  if (extras.firstName || extras.lastName) {
    const addressInfo: {
      hashedFirstName?: string;
      hashedLastName?: string;
      countryCode?: string;
    } = { countryCode: "BR" };
    if (extras.firstName) {
      const norm = stripAccents(extras.firstName).trim().toLowerCase();
      if (norm) addressInfo.hashedFirstName = sha256(norm);
    }
    if (extras.lastName) {
      const norm = stripAccents(extras.lastName).trim().toLowerCase();
      if (norm) addressInfo.hashedLastName = sha256(norm);
    }
    list.push({ addressInfo });
  }

  return list;
}

export function buildUserExtrasFromName(
  fullName: string,
  email?: string,
  phone?: string,
): UserExtras {
  const { first, last } = splitName(fullName);
  return { email, phone, firstName: first, lastName: last };
}

export async function sendGA4Event(input: GA4EventInput): Promise<void> {
  const measurementId =
    process.env.GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret) {
    console.warn("[GA4] envs ausentes, pulando evento");
    return;
  }

  const clientId =
    input.clientId ?? `server.${input.transactionId ?? Date.now()}`;

  const params: Record<string, string | number | boolean> = {
    engagement_time_msec: 100,
  };
  if (input.sessionId) params.session_id = input.sessionId;
  if (input.transactionId) params.transaction_id = input.transactionId;
  if (typeof input.value === "number") params.value = input.value;
  if (input.currency) params.currency = input.currency;
  if (input.params) {
    for (const [k, v] of Object.entries(input.params)) {
      if (v !== undefined) params[k] = v;
    }
  }

  const body = {
    client_id: clientId,
    timestamp_micros: Date.now() * 1000,
    user_agent: input.userAgent,
    events: [{ name: input.eventName, params }],
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
      console.error("[GA4] HTTP", r.status, txt);
      return;
    }
    console.log("[GA4] OK", input.eventName, input.transactionId ?? "");
  } catch (e) {
    console.error("[GA4] exception", e);
  }
}

export interface SendGoogleAdsConversionInput {
  context: RequestContext;
  userExtras: UserExtras;
  orderId: string;
  conversionValue: number;
  currency: string;
  validateOnly?: boolean;
}

export async function sendGoogleAdsConversion(
  input: SendGoogleAdsConversionInput,
): Promise<void> {
  const conversionAction = process.env.GOOGLE_ADS_CONVERSION_ACTION;
  if (!conversionAction) {
    console.warn("[GADS] GOOGLE_ADS_CONVERSION_ACTION ausente, pulando");
    return;
  }

  const userIdentifiers = buildUserIdentifiers(input.userExtras);
  if (userIdentifiers.length === 0) {
    console.warn("[GADS] sem user_identifiers, pulando");
    return;
  }

  await uploadClickConversion({
    conversionAction,
    orderId: input.orderId,
    gclid: input.context.gclid,
    wbraid: input.context.wbraid,
    gbraid: input.context.gbraid,
    conversionDateTime: buildConversionDateTimeBR(),
    conversionValue: input.conversionValue,
    currencyCode: input.currency,
    userIdentifiers,
    userAgent: input.context.userAgent,
    validateOnly: input.validateOnly,
  });
}
