"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function getGaClientId(): string | undefined {
  const raw = getCookie("_ga");
  if (!raw) return undefined;
  const m = raw.match(/^GA\d+\.\d+\.(\d+\.\d+)$/);
  return m ? m[1] : undefined;
}

function getGaSessionId(measurementId: string): string | undefined {
  const container = measurementId.replace("G-", "");
  const raw = getCookie(`_ga_${container}`);
  if (!raw) return undefined;
  const m = raw.match(/^GS[^.]*\.\d+\.(\d+)\./);
  return m ? m[1] : undefined;
}

function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `eid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function sendTrack(
  eventName: "PageView" | "ViewContent",
  pagePath: string,
): Promise<void> {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
    process.env.NEXT_PUBLIC_GA4_ID ??
    "";
  const body = {
    event_name: eventName,
    event_id: generateEventId(),
    page_path: pagePath,
    ga_client_id: getGaClientId(),
    ga_session_id: measurementId ? getGaSessionId(measurementId) : undefined,
  };
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {}
}

export function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = pathname ?? "/";

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: path });
    }
    void sendTrack("PageView", path);

    if (path === "/obrigado") return;

    const t = setTimeout(() => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "view_item", {
          items: [{ item_name: path, item_category: "landing" }],
        });
      }
      void sendTrack("ViewContent", path);
    }, 2500);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
