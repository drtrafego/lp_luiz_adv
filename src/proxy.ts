import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const NINETY_DAYS = 60 * 60 * 24 * 90;
const ONE_YEAR = 60 * 60 * 24 * 365;

function uuidV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function getCookieDomain(hostname: string): string | undefined {
  const eTld = process.env.TRACKING_ETLD_DOMAIN;
  if (!eTld) return undefined;
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return undefined;
  }
  return `.${eTld}`;
}

export function proxy(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  const url = request.nextUrl;
  const hostname = url.hostname;
  const isProd = process.env.NODE_ENV === "production";
  const domain = getCookieDomain(hostname);

  if (!request.cookies.get("_eid")) {
    response.cookies.set({
      name: "_eid",
      value: uuidV4(),
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
      secure: isProd,
      domain,
    });
  }

  const gclid = url.searchParams.get("gclid");
  const wbraid = url.searchParams.get("wbraid");
  const gbraid = url.searchParams.get("gbraid");

  const ts = Math.floor(Date.now() / 1000);

  if (gclid && !request.cookies.get("_gcl_aw")) {
    response.cookies.set({
      name: "_gcl_aw",
      value: `GCL.${ts}.${gclid}`,
      path: "/",
      maxAge: NINETY_DAYS,
      sameSite: "lax",
      secure: isProd,
      domain,
    });
  }

  if (wbraid && !request.cookies.get("_gcl_wbraid")) {
    response.cookies.set({
      name: "_gcl_wbraid",
      value: `GCL.${ts}.${wbraid}`,
      path: "/",
      maxAge: NINETY_DAYS,
      sameSite: "lax",
      secure: isProd,
      domain,
    });
  }

  if (gbraid && !request.cookies.get("_gcl_gbraid")) {
    response.cookies.set({
      name: "_gcl_gbraid",
      value: `GCL.${ts}.${gbraid}`,
      path: "/",
      maxAge: NINETY_DAYS,
      sameSite: "lax",
      secure: isProd,
      domain,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)"],
};
