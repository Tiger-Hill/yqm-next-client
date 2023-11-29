"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { markOrderAsCancelled, markOrderAsCompleted } from "@/lib/redux/slices/adminSlice";
import { motion } from "framer-motion";

import OrderProductRow from "./OrderProductRow";

import Image from "next/image";
import OrderConfirmationModal from "./OrderConfirmationModal";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import classes from "./OrderRow.module.scss";

const OrderRow = ({ order, rowIndex }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const showOrderConfirmationModal = () => setShowConfirmationModal([true, "confirmation"]);
  const showOrderCancellationModal = (order) => setShowConfirmationModal([order, true, "cancellation"]);
  const closeOrderConfirmationModal = () => setShowConfirmationModal(false);

  return (
    <motion.div
      className={classes["order-row"]}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
    >
      <div className={classes["top-container"]}>
        <div className={classes["order-type"]}>
          <p>{order.orders[0].orderType}</p>
        </div>
        <div className={classes["order-total"]}>
          <p>
            {order.orders[0].orderCurrency} 
            {order.orders
              .reduce((acc, order) => {
                return acc + Number(order.orderPrice);
              }, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className={classes["order-payment-id"]}>
          {/* <p>{order.referenceNumber}</p> */}
        </div>

        <div className={classes["order-date"]}>
          <p>{order.orders[0].orderDate}</p>
        </div>
      </div>

      <div className={classes["mid-container"]}>
        <div className={classes["order-products"]}>
          <ul>
            {order.orders.map((order, i) => {
              return (
                <OrderProductRow
                  key={`${order.product.slug}${i}`}
                  order={order}
                  index={i}
                  showOrderCancellationModal={showOrderCancellationModal}
                  // showOrderConfirmationModal={showOrderConfirmationModal}
                />
              );
            })}
          </ul>
        </div>
      </div>

      {showConfirmationModal[1] === true && (
        <OrderConfirmationModal
          closeOrderConfirmationModal={closeOrderConfirmationModal}
          type={showConfirmationModal[2]}
          order={showConfirmationModal[0]}
        />
      )}
    </motion.div>
  );
};

export default OrderRow
