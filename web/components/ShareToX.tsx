"use client";
import React from "react";

export function ShareToX({ title }: { title: string }) {
  const onShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this OneShot: ${title}`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <button onClick={onShare} className="btn-secondary">Share to X</button>
  );
}

