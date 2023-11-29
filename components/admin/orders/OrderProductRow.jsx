import Image from "next/image"
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import classes from "./OrderRow.module.scss";

const OrderProductRow = ({ order, index, showOrderCancellationModal }) => {
  return (
    <li
      // key={`${order.product.slug}${index}`}
      className={classes["order-product"]}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${order.product.images[0]}`}
        alt={order.product.productName}
        width={60}
        height={60}
      />

      <div className={classes["order-product-details"]}>
        <p className={classes["order-status"]}>{order.orderStatus}</p>
        <p>{order.product.productName}</p>
        <p>
          {order.orderCurrency} {Number(order.orderPrice).toFixed(2)} - x
          {Number(order.orderQuantity).toFixed()}
        </p>
      </div>

      <div className={classes["actions"]}>
        {/* <DoneIcon
          className={classes["accept-icon"]}
          onClick={() => showOrderConfirmationModal()}
        /> */}
        <CancelIcon
          className={classes["deny-icon"]}
          onClick={() => showOrderCancellationModal(order)}
        />
      </div>
    </li>
  );
};

export default OrderProductRow
