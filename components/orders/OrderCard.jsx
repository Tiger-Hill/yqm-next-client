import Image from "next/image";
import classes from "./Orders.module.scss";

const OrderCard = ({ order }) => {
  return (
    <div className={classes["order-card-container"]}>
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${order.product.images[0]}`}
        alt="Product image"
        width={150}
        height={150}
      />

      <div className={classes["order-details"]}>
        <p className={classes["order-status"]}>{order.orderStatus}</p>
        <p className={classes["product-name"]}>{order.product.productName}</p>
        <p className={classes["quantity-price"]}>
          x{order.orderQuantity} - {order.orderCurrency} {Number(order.orderPrice).toFixed(2)}
        </p>
        <p></p>
      </div>
    </div>
  );
};

export default OrderCard;
