import { promises as fs } from "fs";
import path from "path";

export type Game = {
  username: string;
  slug: string;
  title: string;
  description?: string;
  displayName?: string;
  email?: string;
  tags?: string[];
  xHandle?: string; // X/Twitter handle for credit
  llm?: string; // e.g., chatgpt | claude | grok
  prompt?: string; // original prompt used
  path: string; // public path to html
  type: "ugc" | "legacy";
  status: "pending" | "approved";
  createdAt: number;
};

export type DB = {
  users: Record<string, { username: string; games: Game[] }>;
  games: Game[];
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DB;
  } catch {
    return { users: {}, games: [] };
  }
}

export async function writeDB(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function seedOwnerProfile(owner = "cyb3rechos") {
  const db = await readDB();
  db.users[owner] = db.users[owner] || { username: owner, games: [] };
  const ensure = (title: string, legacyFile: string, createdAt: number) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = db.users[owner].games.find((g) => g.slug === slug);
    if (existing) {
      existing.createdAt = createdAt;
      existing.status = "approved";
      existing.path = `/legacy/${legacyFile}`;
      existing.type = "legacy";
      existing.xHandle = "Cyb3rEchos";
      const gi = db.games.findIndex((g) => g.username === owner && g.slug === slug);
      if (gi !== -1) db.games[gi] = existing;
      return;
    }
    const game: Game = {
      username: owner,
      slug,
      title,
      path: `/legacy/${legacyFile}`,
      type: "legacy",
      status: "approved",
      createdAt,
      xHandle: "Cyb3rEchos",
    };
    db.users[owner].games.push(game);
    db.games.push(game);
  };
  // Assign dates: base 2025-07-04, then spaced/randomized to current
  const dates = {
    hangman: Date.parse("2025-07-04T10:00:00Z"),
    sudoku: Date.parse("2025-07-10T12:00:00Z"),
    slider: Date.parse("2025-07-20T15:30:00Z"),
    what: Date.parse("2025-08-05T09:15:00Z"),
    tetris: Date.parse("2025-08-28T18:45:00Z"),
  };
  ensure("OneShot Hangman", "hangman.html", dates.hangman);
  ensure("OneShot Sudoku", "sudoku.html", dates.sudoku);
  ensure("OneShot Slider", "sliding_puzzle.html", dates.slider);
  ensure("OneShot What", "guess_what.html", dates.what);
  ensure("OneShot Tetris", "tetris.html", dates.tetris);
  await writeDB(db);
  return db;
}

export async function latestFeatured(): Promise<Game | null> {
  const db = await readDB();
  const approved = db.games.filter((g) => (g.type === "legacy" || g.status === "approved"));
  if (approved.length === 0) return null;
  approved.sort((a, b) => b.createdAt - a.createdAt);
  return approved[0];
}
