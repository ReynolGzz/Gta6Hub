/**
 * Centralized environment access + feature flags.
 *
 * Every integration is optional. Instead of throwing when a key is missing,
 * we expose boolean feature flags so the UI and API layers can degrade
 * gracefully (the whole app runs with zero configuration).
 */

const get = (key: string): string | undefined => {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
};

export const env = {
  DATABASE_URL: get("DATABASE_URL") ?? "file:./dev.db",
  NEXTAUTH_SECRET: get("NEXTAUTH_SECRET") ?? "dev-secret-change-me",
  NEXTAUTH_URL: get("NEXTAUTH_URL") ?? "http://localhost:3000",
  SITE_URL: get("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",

  OPENAI_API_KEY: get("OPENAI_API_KEY"),
  OPENAI_MODEL: get("OPENAI_MODEL") ?? "gpt-4o-mini",

  MAPBOX_TOKEN: get("NEXT_PUBLIC_MAPBOX_TOKEN"),

  STRIPE_SECRET_KEY: get("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: get("STRIPE_WEBHOOK_SECRET"),
  STRIPE_PRICE_ID: get("STRIPE_PRICE_ID"),
  STRIPE_PUBLISHABLE_KEY: get("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),

  POSTHOG_KEY: get("NEXT_PUBLIC_POSTHOG_KEY"),
  POSTHOG_HOST: get("NEXT_PUBLIC_POSTHOG_HOST") ?? "https://us.i.posthog.com",
} as const;

export const features = {
  ai: Boolean(env.OPENAI_API_KEY),
  map: Boolean(env.MAPBOX_TOKEN),
  stripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID),
  analytics: Boolean(env.POSTHOG_KEY),
} as const;

/** Client-safe feature flags derived from NEXT_PUBLIC_* vars only. */
export const publicFeatures = {
  map: Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN),
  stripe: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  analytics: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
} as const;
