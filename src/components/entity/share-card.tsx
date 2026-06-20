"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Viral share module: copies a snippet + link for social/TikTok sharing. */
export function ShareCard({ title, stat, path }: { title: string; stat: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    const text = `${title} — ${stat} | via ViceHub`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={share} className="gap-2">
      {copied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4" />}
      {copied ? "Copied!" : "Share"}
      {!copied && <Copy className="size-3 opacity-50" />}
    </Button>
  );
}
