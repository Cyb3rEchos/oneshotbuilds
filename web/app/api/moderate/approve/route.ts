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
  const game = user.games.find((g) => g.slug === slug);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  game.status = "approved";
  const idx = db.games.findIndex((g) => g.username === username && g.slug === slug);
  if (idx !== -1) db.games[idx] = game;
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
