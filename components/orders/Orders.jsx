"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, createOrder , flashOrderCreateStripeSuccessNotification} from "@/lib/redux/slices/orderSlice";
import { clearBasket } from "@/lib/redux/slices/basketSlice";
import { useRouter, useSearchParams } from "next/navigation";

import TableCollapsibleMUI from "@/components/UI/TableCollapsibleMUI";
import classes from "./Orders.module.scss";

const Orders = ({ lng}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orders, notification } = useSelector(state => state.rootReducer.order);

  // ! To get all orders when landing on the page
  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  // ! For Stripe payment
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  console.log(sessionId);

  const { basket } = useSelector(state => state.rootReducer.basket);
  const hasEffectRun = useRef(false);
  useEffect(() => {
    if (!hasEffectRun.current && sessionId) {
        hasEffectRun.current = true;
      try {
        fetch (`/api/session_status?session_id=${sessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(res => res.json())
        .then(orderData => {
          console.log(orderData);

          if (orderData.status === "complete") {
            const orderProducts = {
              productId: [],
              orderQuantity: [],
            }

            basket.map(product => {
              orderProducts.productId.push(product.product.slug);
              orderProducts.orderQuantity.push(product.quantity);
            });

            const paymentId = `stripe-date-timestamp-${Date.now()}`;
            const orderCurrency = "SGD";
            const orderType = "Buy";

            dispatch(createOrder({ orderProducts, orderDetails: { orderCurrency, orderType, paymentId }})) // * Add payment id);
            dispatch(clearBasket());
          } else {
            // * FLASH ERROR
            console.log("Order not complete");
            dispatch(flashOrderCreateStripeSuccessNotification());
          }
        });

      } catch (error) {
        console.log(error);
      }

      router.push(`/${lng}/orders`);
    }
  }, [sessionId]);

  return (
    <section className={classes["orders-section"]}>
      <h2>Orders</h2>

      {orders && <TableCollapsibleMUI orders={orders} />}
    </section>
  );
}

export default Orders
