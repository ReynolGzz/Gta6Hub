import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env, features } from "@/lib/env";

/** Stripe webhook: keeps the user's plan in sync with their subscription. */
export async function POST(req: Request) {
  if (!features.stripe || !stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const setPlanByCustomer = async (customerId: string, plan: string, subId?: string) => {
    await db.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { plan, ...(subId ? { stripeSubId: subId } : {}) },
    });
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.customer) await setPlanByCustomer(String(s.customer), "PREMIUM", String(s.subscription ?? ""));
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const active = sub.status === "active" || sub.status === "trialing";
      await setPlanByCustomer(String(sub.customer), active ? "PREMIUM" : "FREE", sub.id);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlanByCustomer(String(sub.customer), "FREE");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
