import { readDB } from "@/lib/db";
import ReviewClient from "@/components/ReviewClient";

export default async function ReviewPage() {
  const db = await readDB();
  const pending = db.games
    .filter((g: any) => g.type === "ugc" && g.status === "pending")
    .map((g: any) => ({
      username: g.username,
      slug: g.slug,
      title: g.title,
      xHandle: g.xHandle,
      createdAt: g.createdAt,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pending submissions</h1>
          <p className="text-neutral-300 mt-1">Use your moderator token to approve or reject.</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="btn-secondary h-9" type="submit">Logout</button>
        </form>
      </div>
      <ReviewClient initial={pending} />
    </div>
  );
}
