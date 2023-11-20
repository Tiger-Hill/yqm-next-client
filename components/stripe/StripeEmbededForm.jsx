import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate
// } from "react-router-dom";

// import "./App.css";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripeEmbededForm = ({ lng, basketData }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (clientSecret) return;

    // Create a Checkout Session as soon as the page loads
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basketData: basketData,
        lng: lng,
      }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data));
  }, [clientSecret]);

  console.log(clientSecret);

  // const handleComplete = (checkoutSession) => {
  //   console.log("NIQUE TA MERE LA GROSSE PUTE FILS DE CHIEN DE TES GRANDS MORTS");
  // }

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          {/* <h2>Checkout</h2> */}
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
};

export default StripeEmbededForm;








// import { loadStripe } from "@stripe/stripe-js";
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout,
// } from "@stripe/react-stripe-js";

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const StripeButton2 = ({ clientSecret }) => {
//   const options = { clientSecret };

//   return (
//     <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
//       <EmbeddedCheckout />
//     </EmbeddedCheckoutProvider>
//   );
// };
