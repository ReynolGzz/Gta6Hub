import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { MapView } from "@/components/map/map-view";
import { env } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Map",
  description: "Explore GTA 6 cars, businesses, weapons, collectibles and secrets on an interactive map. Track your progress.",
  path: "/map",
});

export default async function MapPage() {
  const markers = await db.mapMarker.findMany();
  return (
    <>
      <PageHeader
        title="Interactive Map"
        icon="Map"
        accent="blue"
        description="Cars, businesses, weapons, properties, collectibles, secrets and missions across Leonida. Toggle layers and track what you've found."
      />
      <div className="container py-10">
        <MapView markers={markers} token={env.MAPBOX_TOKEN ?? null} />
      </div>
    </>
  );
}
