import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const gtagId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID ??
    null;
  const googleAdsConversionId =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ?? null;
  const googleAdsConversionLabel =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? null;
  const leadValue = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? "1000");
  const leadCurrency = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? "BRL";

  return NextResponse.json(
    {
      gtagId,
      googleAdsConversionId,
      googleAdsConversionLabel,
      leadValue,
      leadCurrency,
    },
    {
      headers: { "Cache-Control": "public, max-age=300" },
    },
  );
}
