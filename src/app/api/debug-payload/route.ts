import { NextRequest, NextResponse } from "next/server";
import {
  buildClickConversion,
  buildConversionDateTimeBR,
} from "@/lib/google-ads";
import {
  buildUserExtrasFromName,
  buildUserIdentifiers,
  parseRequestContext,
} from "@/lib/tracking-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const requiredToken = process.env.DEBUG_PAYLOAD_TOKEN;
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !requiredToken) {
    return NextResponse.json(
      {
        success: false,
        message:
          "DEBUG_PAYLOAD_TOKEN must be configured for production debug payload access",
      },
      { status: 401 },
    );
  }
  if (requiredToken) {
    const token = req.headers.get("x-debug-token");
    if (token !== requiredToken) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 },
      );
    }
  }

  const url = req.nextUrl;
  const eventName = url.searchParams.get("event_name") ?? "Lead";
  const phone = url.searchParams.get("phone") ?? undefined;
  const name = url.searchParams.get("name") ?? "Joao Silva";
  const email = url.searchParams.get("email") ?? undefined;
  const orderId =
    url.searchParams.get("order_id") ?? `debug_${Date.now()}`;

  const context = parseRequestContext(req);
  const extras = buildUserExtrasFromName(name, email, phone);
  const userIdentifiers = buildUserIdentifiers(extras);

  const conversionAction =
    process.env.GOOGLE_ADS_CONVERSION_ACTION ??
    "customers/0000000000/conversionActions/0000000000";
  const currency = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? "BRL";
  const value = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? "1000");

  const conversion = buildClickConversion({
    conversionAction,
    orderId,
    gclid: context.gclid,
    wbraid: context.wbraid,
    gbraid: context.gbraid,
    conversionDateTime: buildConversionDateTimeBR(),
    conversionValue: value,
    currencyCode: currency,
    userIdentifiers,
  });

  return NextResponse.json(
    {
      event_name: eventName,
      payload: {
        conversions: [conversion],
        partialFailure: true,
        validateOnly: true,
      },
      context: {
        gclid: context.gclid,
        wbraid: context.wbraid,
        gbraid: context.gbraid,
        externalId: context.externalId,
        gaClientId: context.gaClientId,
      },
      normalized: {
        email,
        phone,
        firstName: extras.firstName,
        lastName: extras.lastName,
      },
    },
    { status: 200 },
  );
}
