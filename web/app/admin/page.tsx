"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!data.ok) {
      setMsg("Invalid token");
      return;
    }
    router.push("/admin/review");
  };

  return (
    <div className="max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin access</h1>
        <p className="text-neutral-300 mt-1">Enter your moderator token to continue.</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="MOD_TOKEN"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="btn-primary">Continue</button>
      </form>
      {msg && <div className="text-sm text-red-500">{msg}</div>}
    </div>
  );
}

