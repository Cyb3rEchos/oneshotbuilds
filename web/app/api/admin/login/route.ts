import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let token = "";
  if (contentType.includes("application/json")) {
    const data = await req.json().catch(() => ({}));
    token = String((data as any).token || "");
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const data = await req.formData();
    token = String(data.get("token") || "");
  } else {
    const data = await req.formData().catch(() => null);
    token = data ? String(data.get("token") || "") : "";
  }

  const expected = process.env.MOD_TOKEN || "dev-token";
  const ok = token === expected;
  const res = NextResponse.json({ ok });
  if (ok) {
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  return res;
}
