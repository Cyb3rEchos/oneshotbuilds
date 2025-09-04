import Link from "next/link";
import { readDB } from "@/lib/db";

const curated = [
  { title: "OneShot Hangman", href: "/legacy/hangman.html" },
  { title: "OneShot Sudoku", href: "/legacy/sudoku.html" },
  { title: "OneShot Slider", href: "/legacy/sliding_puzzle.html" },
  { title: "OneShot What", href: "/legacy/guess_what.html" },
  { title: "OneShot Tetris", href: "/legacy/tetris.html" },
];

export default async function ExplorePage() {
  const db = await readDB();
  const owner = "Cyb3rEchos";
  const ownerGames = db.games.filter((g) => g.type === "legacy");
  const community = db.games.filter((g) => g.type === "ugc" && g.status === "approved");
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="text-neutral-300 mt-1">Owner builds and approved community submissions.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">From @{owner}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ownerGames.map((g) => (
            <div key={`${g.username}-${g.slug}`} className="card p-4 hover:shadow-sm">
              <div className="text-xs text-neutral-500">
                by <a href="https://x.com/Cyb3rEchos" target="_blank" rel="noopener noreferrer" className="underline">@Cyb3rEchos</a>
              </div>
              <Link href={`/play/${g.username}/${g.slug}`} className="mt-1 font-medium block hover:underline">
                {g.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Community Uploads</h2>
        {community.length === 0 ? (
          <p className="text-sm text-neutral-300">No community uploads yet. Be the first to <Link href="/submit" className="underline">submit</Link>.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {community.map((g) => (
              <div key={`${g.username}-${g.slug}`} className="card p-4 hover:shadow-sm">
                <div className="text-xs text-neutral-500">
                  by {g.xHandle ? (
                    <a href={`https://x.com/${g.xHandle}`} target="_blank" rel="noopener noreferrer" className="underline">@{g.xHandle}</a>
                  ) : (
                    <span>@{g.username}</span>
                  )}
                </div>
                <Link href={`/play/${g.username}/${g.slug}`} className="mt-1 font-medium block hover:underline">
                  {g.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
