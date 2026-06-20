import Stripe from "stripe";
import { env, features } from "./env";

/**
 * Stripe is optional. When keys are absent, `stripe` is null and callers fall
 * back to a clearly-marked dev/free mode (see /api/stripe/checkout).
 */
export const stripe: Stripe | null = features.stripe
  ? new Stripe(env.STRIPE_SECRET_KEY!)
  : null;

export const PREMIUM_PRICE_USD = 4.99;

export const PREMIUM_FEATURES = [
  "Advanced progress tracking",
  "Full GTA 6 AI assistant",
  "Custom map routes",
  "Unlimited saved builds",
  "Ad-free experience",
  "Priority access to new features",
];

/** Whether a given plan string unlocks premium features. */
export function isPremium(plan: string | undefined | null): boolean {
  return plan === "PREMIUM";
}
