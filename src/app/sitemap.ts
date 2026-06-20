import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { ENTITIES, GENERIC_ENTITIES } from "@/lib/entities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.SITE_URL;
  const now = new Date();

  const staticRoutes = [
    "",
    "/search",
    "/map",
    "/ai",
    "/pricing",
    ...ENTITIES.map((e) => e.route),
  ].map((path) => ({ url: `${base}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 }));

  const [cars, money, entities] = await Promise.all([
    db.car.findMany({ select: { slug: true, updatedAt: true } }),
    db.moneyMethod.findMany({ select: { slug: true, updatedAt: true } }),
    db.entity.findMany({ select: { type: true, slug: true, updatedAt: true } }),
  ]);

  const carUrls = cars.map((c) => ({ url: `${base}/cars/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 }));
  const moneyUrls = money.map((m) => ({ url: `${base}/money/${m.slug}`, lastModified: m.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 }));

  const kindByDbType = Object.fromEntries(GENERIC_ENTITIES.map((e) => [e.dbType, e.kind]));
  const entityUrls = entities
    .map((e) => {
      const kind = kindByDbType[e.type];
      if (!kind) return null;
      return { url: `${base}/${kind}/${e.slug}`, lastModified: e.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...carUrls, ...moneyUrls, ...entityUrls];
}
