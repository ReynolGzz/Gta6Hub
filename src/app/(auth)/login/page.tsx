import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo";
import { features } from "@/lib/env";

export const metadata: Metadata = buildMetadata({ title: "Log in", path: "/login" });

export default function LoginPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <Suspense>
        <LoginForm discordEnabled={features.discordAuth} />
      </Suspense>
    </div>
  );
}
