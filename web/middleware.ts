import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("admin_auth")?.value;
    if (cookie !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      if (pathname !== "/admin") return NextResponse.redirect(url);
    }
    // Add noindex header
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

