import type { Metadata } from "next";
import { AiChat } from "@/components/ai/ai-chat";
import { features } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "GTA 6 AI Assistant",
  description: "A retrieval-grounded AI assistant that answers GTA 6 questions using only the ViceHub database.",
  path: "/ai",
});

export default function AiPage() {
  return (
    <div className="container py-10">
      <AiChat llmEnabled={features.ai} />
    </div>
  );
}
