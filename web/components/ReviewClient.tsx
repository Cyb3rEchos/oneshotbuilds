"use client";
import { useEffect, useState } from "react";

type Item = {
  username: string;
  slug: string;
  title: string;
  xHandle?: string;
  createdAt: number;
};

export default function ReviewClient({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [token, setToken] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const t = localStorage.getItem("MOD_TOKEN") || "";
    setToken(t);
  }, []);

  const saveToken = () => {
    localStorage.setItem("MOD_TOKEN", token);
    setMsg("Moderator token saved locally.");
    setTimeout(() => setMsg(""), 1500);
  };

  const act = async (kind: "approve" | "reject", it: Item) => {
    setMsg("");
    if (!token) {
      setMsg("Enter your moderator token first.");
      return;
    }
    const res = await fetch(`/api/moderate/${kind}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ username: it.username, slug: it.slug }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => !(p.username === it.username && p.slug === it.slug)));
      setMsg(`${kind === "approve" ? "Approved" : "Rejected"}: ${it.title}`);
      setTimeout(() => setMsg(""), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data?.error || `Failed to ${kind}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card p-4">
        <p className="text-sm text-neutral-700">No pending submissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-end gap-3">
          <div className="grow">
            <label className="block text-sm font-medium">Moderator token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              placeholder="Enter MOD_TOKEN"
            />
          </div>
          <button onClick={saveToken} className="btn-secondary h-9">Save</button>
        </div>
        {msg && <p className="mt-2 text-xs text-neutral-600">{msg}</p>}
      </div>

      <div className="grid gap-4">
        {items.map((it) => (
          <div key={`${it.username}-${it.slug}`} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">@{it.xHandle || it.username} · {new Date(it.createdAt).toLocaleString()}</div>
                <div className="font-medium">{it.title}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => act("reject", it)} className="btn-secondary">Reject</button>
                <button onClick={() => act("approve", it)} className="btn-primary">Approve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

