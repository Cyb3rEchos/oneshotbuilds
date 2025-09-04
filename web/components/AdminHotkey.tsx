"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHotkey() {
  const router = useRouter();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Shift + A opens admin
      if ((e.key === "A" || e.key === "a") && e.shiftKey) {
        e.preventDefault();
        router.push("/admin");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);
  return null;
}

