import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = slugify(String(form.get("title") || ""));
    const description = String(form.get("description") || "").slice(0, 800);
    const tagsRaw = String(form.get("tags") || "");
    const xHandle = String(form.get("xHandle") || "").replace(/^@/, "").slice(0, 15);
    let llm = String(form.get("llm") || "").toLowerCase();
    const prompt = String(form.get("prompt") || "").slice(0, 4000);
    const llmOther = String(form.get("llmOther") || "").slice(0, 16);
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6);
    const file = form.get("file");

    if (!title || !(file instanceof File) || !description || !tagsRaw || !llm || !prompt) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!xHandle || !/^[A-Za-z0-9_]{1,15}$/.test(xHandle)) {
      return NextResponse.json({ error: "Valid X handle is required" }, { status: 400 });
    }
    if (!file.name.endsWith(".html")) {
      return NextResponse.json({ error: "Only .html files allowed" }, { status: 400 });
    }
    const MAX_BYTES = 600 * 1024; // ~600KB limit for single-file uploads
    if ((file as any).size && (file as any).size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 600KB)" }, { status: 400 });
    }

    const allowed = ["chatgpt","claude","gemini","llama","mistral","deepseek","cohere","perplexity","grok","other"];
    if (!allowed.includes(llm)) {
      return NextResponse.json({ error: "Invalid LLM selection." }, { status: 400 });
    }
    if (llm === "other") {
      const name = llmOther.trim();
      if (!name || name.length === 0 || name.length > 16) {
        return NextResponse.json({ error: "Custom model name must be 1–16 characters." }, { status: 400 });
      }
      llm = name;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const text = buf.toString("utf8");

    // Basic safety checks: block external networks and risky tags
    const hasExternal = /(src|href)\s*=\s*["']\s*(https?:)?\/\//i.test(text);
    const hasBase = /<\s*base\b/i.test(text);
    const hasIframe = /<\s*iframe\b/i.test(text);
    const hasObject = /<\s*(object|embed)\b/i.test(text);
    const hasLinkTag = /<\s*link\b/i.test(text); // disallow external CSS refs
    const hasMetaRefresh = /<\s*meta[^>]*http-equiv\s*=\s*["']refresh/i.test(text);
    if (hasExternal || hasBase || hasIframe || hasObject || hasLinkTag || hasMetaRefresh) {
      return NextResponse.json({
        error:
          "Submission contains disallowed references (no external URLs, <link>, <iframe>, <object>, <embed>, <base>, or meta refresh). Use a single HTML file with inline CSS/JS.",
      }, { status: 400 });
    }

    const username = slugify(xHandle);
    const baseDir = path.join(process.cwd(), "public", "ugc", username, title);
    await fs.mkdir(baseDir, { recursive: true });
    const target = path.join(baseDir, "index.html");
    await fs.writeFile(target, buf);

    // Local-only JSON registry (simple append)
    try {
      const dbPath = path.join(process.cwd(), "data", "db.json");
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      let db = { users: {}, games: [] as any[] } as any;
      try {
        const existing = await fs.readFile(dbPath, "utf8");
        db = JSON.parse(existing);
      } catch {}
      db.users[username] = db.users[username] || { username, games: [] };
      const game = {
        username,
        slug: title,
        title,
        description,
        tags,
        llm,
        prompt,
        path: `/ugc/${username}/${title}/index.html`,
        type: "ugc",
        xHandle,
        status: "pending",
        createdAt: Date.now(),
      };
      db.users[username].games.push(game);
      db.games.push(game);
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
    } catch {}

    const playUrl = `/play/${username}/${title}`;
    return NextResponse.json({ ok: true, playUrl, status: "pending" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
