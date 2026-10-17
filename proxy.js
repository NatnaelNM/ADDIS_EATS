import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session-token";

// Protect private routes using a verified signed session, not cookie presence alone.
export function proxy(request) {
  const token = request.cookies.get("session")?.value;
  const user = verifySessionToken(token);

  if (!user) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/kitchen/:path*", "/dashboard/:path*", "/admin/:path*"],
};
