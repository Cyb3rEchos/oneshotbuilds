import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { cookies } from "next/headers";

function authOk(req: NextRequest) {
  const token = req.headers.get("x-admin-token") || "";
  const env = process.env.MOD_TOKEN || "dev-token";
  if (token === env) return true;
  const cookie = cookies().get("admin_auth")?.value;
  return cookie === "1";
}

export async function POST(req: NextRequest) {
  if (!authOk(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const username = String(data.username || "");
  const slug = String(data.slug || "");
  if (!username || !slug) return NextResponse.json({ error: "Missing" }, { status: 400 });
  const db = await readDB();
  const user = db.users[username];
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  user.games = user.games.filter((g) => !(g.slug === slug));
  db.games = db.games.filter((g) => !(g.username === username && g.slug === slug));
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
