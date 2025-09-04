import fs from "fs";
import path from "path";
import { readDB } from "@/lib/db";
import { ShareToX } from "@/components/ShareToX";

type Params = { params: Promise<{ username: string; slug: string }> };

export default async function PlayPage({ params }: Params) {
  const { username, slug } = await params;
  const db = await readDB();
  const user = db.users[username];
  const game = user?.games.find((g) => g.slug === slug);
  const filePath = path.join(process.cwd(), "public", "ugc", username, slug, "index.html");
  const exists = fs.existsSync(filePath);
  const isLegacy = game?.type === "legacy";
  const approved = isLegacy || game?.status === "approved";
  const src = isLegacy
    ? (game?.path || "/404")
    : (exists && approved ? `/ugc/${username}/${slug}/index.html` : "/404");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium">{game?.title || slug}</h1>
        <p className="text-sm text-neutral-600">
          by {game?.xHandle ? (
            <a href={`https://x.com/${game.xHandle}`} target="_blank" rel="noopener noreferrer" className="underline">@{game.xHandle}</a>
          ) : (
            <span>@{username}</span>
          )}
          {game?.createdAt && (
            <span> · {new Date(game.createdAt).toLocaleString()}</span>
          )}
        </p>
      </div>
      {approved ? (
        <div className="rounded-2xl overflow-hidden bg-transparent">
          <div className="ring-gradient p-[2px] rounded-2xl">
            <div className="bg-white rounded-xl overflow-hidden">
              <iframe
                title={`${slug} by ${username}`}
                src={src}
                className="w-full h-[80vh]"
                sandbox="allow-scripts allow-pointer-lock allow-popups allow-top-navigation-by-user-activation"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
          This submission is pending review.
        </div>
      )}
      <div className="mt-4 flex gap-3">
        <ShareToX title={game?.title || slug} />
        {game?.xHandle && (
          <a className="btn-secondary" href={`https://x.com/${game.xHandle}`} target="_blank" rel="noopener noreferrer">View on X</a>
        )}
      </div>
      <p className="text-xs text-neutral-300">
        Runs in a sandboxed iframe for safety. In production, user content will live on an isolated domain.
      </p>
    </div>
  );
}
