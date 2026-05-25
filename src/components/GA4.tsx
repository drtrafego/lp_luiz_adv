"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GA4() {
  const gaId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
  if (!gaId && !adsId) return null;

  const loaderId = gaId ?? adsId;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}', { send_page_view: false });` : ""}
          ${adsId ? `gtag('config', '${adsId}');` : ""}
        `}
      </Script>
    </>
  );
}
