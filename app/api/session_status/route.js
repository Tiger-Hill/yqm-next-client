import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export async function GET (req, res) {
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
  const sessionId = req.nextUrl.searchParams.get("session_id");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  // const customer = await stripe.customers.retrieve(session.customer);

  return NextResponse.json({
    status: session.status,
    payment_status: session.payment_status,
    // customer_email: customer.email,
  });
};
