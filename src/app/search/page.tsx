import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search the entire GTA 6 database — cars, money methods, weapons, businesses, missions and more.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
