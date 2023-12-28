
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export async function POST (req, res) {

    const data = await req.json();
    console.log(data);
    const basket = data.basketData;
    const lng = data.lng;
    console.log(lng);

    try {
      // * Create Checkout Sessions from body params.
      const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

      // * Create an array of line items from the basket to send to Stripe API
      const lineItems = basket.map(item => ({
        price_data: {
          currency: "sgd",
          product_data: {
            name: item.product.productName,
            description: item.product.productDescription,
          },
          // unit_amount: +Number(item.product.latestPrice) * 100, // ? Price in cents mandatory
          unit_amount: (+Number(item.product.latestPrice) * 100).toFixed(), // ? Price in cents mandatory
        },
        quantity: item.quantity,
      }));

      // ? See line items
      // console.log(lineItems);
      // console.log(lineItems[0]);

      // * Creates the Stripe Checkout Session with the line items
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        ui_mode: 'embedded',
        // redirect_on_completion: "never",
        // return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}'
        return_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${lng}/orders?session_id={CHECKOUT_SESSION_ID}`
      });

      return NextResponse.json(session.client_secret);
    } catch (error) {
      console.error("Failed to create order:", error);
      throw new Error("Failed to create order.");
    }
}
