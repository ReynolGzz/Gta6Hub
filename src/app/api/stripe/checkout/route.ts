import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { env, features } from "@/lib/env";

/**
 * Starts a Stripe Checkout session for the $4.99/mo premium plan.
 * When Stripe is not configured, we simulate the upgrade in dev so premium
 * features remain testable, and clearly flag it as dev mode.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  // Dev/free fallback: no Stripe keys configured.
  if (!features.stripe || !stripe) {
    await db.user.update({
      where: { id: session.user.id },
      data: { plan: "PREMIUM" },
    });
    return NextResponse.json({
      devMode: true,
      message: "Stripe is not configured — premium unlocked in dev mode. Sign out and back in to refresh your plan.",
    });
  }

  // Ensure a Stripe customer exists.
  let user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    user = await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId!,
    line_items: [{ price: env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${env.SITE_URL}/dashboard?upgraded=1`,
    cancel_url: `${env.SITE_URL}/pricing`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkout.url });
}
