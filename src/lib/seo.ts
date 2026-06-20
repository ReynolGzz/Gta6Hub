import type { Metadata } from "next";
import { env } from "./env";

const SITE_NAME = "ViceHub";
const DEFAULT_DESCRIPTION =
  "ViceHub is the searchable GTA 6 intelligence platform — instantly find the fastest cars, best money methods, weapons, businesses and secrets.";

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const title = opts.title ? `${opts.title} · ${SITE_NAME}` : `${SITE_NAME} — The GTA 6 Intelligence Platform`;
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const url = `${env.SITE_URL}${opts.path ?? ""}`;

  return {
    title,
    description,
    metadataBase: new URL(env.SITE_URL),
    alternates: { canonical: opts.path ?? "/" },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Schema.org JSON-LD builders for rich results. */
export function vehicleJsonLd(car: {
  name: string;
  summary: string;
  category: string;
  topSpeed: number;
  price: number;
  realLifeInspiration?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.name,
    description: car.summary,
    vehicleConfiguration: car.category,
    speed: { "@type": "QuantitativeValue", value: car.topSpeed, unitCode: "HM" },
    offers: { "@type": "Offer", price: car.price, priceCurrency: "USD" },
    ...(car.realLifeInspiration ? { model: car.realLifeInspiration } : {}),
  };
}

export function itemListJsonLd(name: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${env.SITE_URL}${it.url}`,
    })),
  };
}

export function articleJsonLd(opts: { headline: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: `${env.SITE_URL}${opts.path}`,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}
