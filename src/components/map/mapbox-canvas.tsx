"use client";

import { useState } from "react";
import Map, { Marker as MapMarker, Popup, NavigationControl } from "react-map-gl";
import Link from "next/link";
import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Marker } from "./map-view";

/** Live Mapbox canvas — only mounted when a token is present. */
export function MapboxCanvas({
  token,
  markers,
  categoryColor,
}: {
  token: string;
  markers: Marker[];
  categoryColor: Record<string, string>;
}) {
  const [selected, setSelected] = useState<Marker | null>(null);

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ longitude: -80.2, latitude: 25.78, zoom: 10 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" />
      {markers.map((m) => (
        <MapMarker
          key={m.id}
          longitude={m.lng}
          latitude={m.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelected(m);
          }}
        >
          <MapPin className="size-6 cursor-pointer drop-shadow" style={{ color: categoryColor[m.category] ?? "#ff2d9b" }} />
        </MapMarker>
      ))}
      {selected && (
        <Popup longitude={selected.lng} latitude={selected.lat} anchor="top" onClose={() => setSelected(null)} closeButton>
          <div className="p-1">
            <p className="text-sm font-semibold text-black">{selected.name}</p>
            {selected.description && <p className="text-xs text-neutral-600">{selected.description}</p>}
            {selected.entityType && selected.entitySlug && (
              <Link href={`/${selected.entityType}/${selected.entitySlug}`} className="mt-1 inline-block text-xs font-medium text-pink-600">
                View details →
              </Link>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}
