"use client";
import { useState } from "react";

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const onLogout = async () => {
    try {
      setBusy(true);
      await fetch("/api/admin/logout", { method: "POST" });
      // Reload to reflect auth change and trigger middleware redirects
      window.location.href = "/";
    } finally {
      setBusy(false);
    }
  };
  return (
    <button onClick={onLogout} className="text-neutral-400 hover:text-white disabled:opacity-60" disabled={busy}>
      {busy ? "Logging out…" : "Logout"}
    </button>
  );
}

