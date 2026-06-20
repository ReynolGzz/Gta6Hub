import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Sign up", path: "/register" });

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <RegisterForm />
    </div>
  );
}
