"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders } from "@/lib/redux/slices/adminSlice";

import OrderRow from "./OrderRow";
import ButtonMui from "@/components/forms/ButtonMui";

import classes from "./../AdminDashboard.module.scss";

const ProcessingOrders = ({ lng }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.rootReducer.admin);

  const [pendingOrders, setPendingOrders] = useState(null);

  const redirectToAllOrdersHandler = () => {
    router.push(`/${lng}/admin_dashboard/orders`);
  }

  // * We get all orders
  useEffect(() => {
    dispatch(getAdminOrders());
  }, []);

  // * We filter the orders to get only the pending ones
  useEffect(() => {
    if (orders) {
      const pendingOrders = orders.filter(order => order.orderStatus === "Processing");
      setPendingOrders(pendingOrders);
    }
  }, [orders]);

  console.log(pendingOrders);

  return (
    <div className={classes["processing-orders-container"]}>
      <h3>Processing Orders</h3>

      <div className={classes["processing-orders"]}>
        {pendingOrders && pendingOrders.map((order, i) => (
          <OrderRow key={`${order.slug}${i}`} order={order} rowIndex={i}/>
        ))}
      </div>

      <ButtonMui
        width="100%"
        height="2.5rem"
        marginTop="2rem"
        fontSize="1.7rem"
        backgroundColor="#f8ae01"
        color="white"
        disabledBakcgroundColor="#DCDCDC"
        disabledColor="white"
        type="button"
        disabled={false}
        text="View all orders"
        onClickHandler={() => redirectToAllOrdersHandler()}
      />
    </div>
  );
};

export default ProcessingOrders;
