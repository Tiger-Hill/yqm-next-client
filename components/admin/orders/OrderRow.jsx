"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { markOrderAsCancelled, markOrderAsCompleted } from "@/lib/redux/slices/adminSlice";
import { motion } from "framer-motion";

import Image from "next/image";
import OrderConfirmationModal from "./OrderConfirmationModal";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import classes from "./OrderRow.module.scss";

const OrderRow = ({ order, rowIndex }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const showOrderConfirmationModal = () => setShowConfirmationModal([true, "confirmation"]);
  const showOrderCancellationModal = () => setShowConfirmationModal([true, "cancellation"]);
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
          <p>{order.orderType}</p>
        </div>
        <div className={classes["order-total"]}>
          <p>
            {order.orderCurrency} 
            {order.orderProducts
              .reduce((acc, obj) => {
                const { orderProduct } = obj;
                return (
                  acc +
                  orderProduct.orderPrice * orderProduct.orderQuantity
                );
              }, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className={classes["order-payment-id"]}>
          <p>{order.slug}</p>
        </div>
        <div className={classes["order-date"]}>
          <p>{order.orderDate}</p>
        </div>
      </div>

      <div className={classes["mid-container"]}>
        <div className={classes["order-products"]}>
          <ul>
            {order.orderProducts.map((obj, i) => {
              const { orderProduct, product } = obj;
              return (
                <li
                  key={`${obj.product.slug}${i}`}
                  className={classes["order-product"]}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                    alt={product.productName}
                    width={30}
                    height={30}
                  />
                  {product.productName} - {order.orderCurrency} 
                  {Number(orderProduct.orderPrice).toFixed(2)} - x
                  {Number(orderProduct.orderQuantity).toFixed()}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={classes["actions"]}>
          <DoneIcon
            className={classes["accept-icon"]}
            onClick={() => showOrderConfirmationModal()}
          />
          <CancelIcon
            className={classes["deny-icon"]}
            onClick={() => showOrderCancellationModal()}
          />
        </div>
      </div>

      {showConfirmationModal && (
        <OrderConfirmationModal
          closeOrderConfirmationModal={closeOrderConfirmationModal}
          type={showConfirmationModal[1]}
          order={order}
        />
      )}
    </motion.div>
  );
};

export default OrderRow
