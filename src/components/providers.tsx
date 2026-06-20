"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import posthog from "posthog-js";

/** Initializes PostHog only when a key is present (no-op otherwise). */
function Analytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || typeof window === "undefined") return;
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        capture_pageview: true,
        person_profiles: "identified_only",
      });
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Analytics />
      {children}
    </SessionProvider>
  );
}
