import OrderCard from "./OrderCard";
import classes from "./Orders.module.scss";

const OrderGroup = ({ orderGroup }) => {
  return (
    <div className={classes["order-group-container"]}>
      <p className={classes["order-date"]}>
        Order date:{" "}
        <span className="bold">{new Date(orderGroup.orders[0].createdAt).toLocaleDateString()}</span>
      </p>

      <p className={classes["order-total-amount"]}>
        Order total amount:{" "}
        <span className="bold">{orderGroup.orders.reduce((acc, order) => {
          return acc + Number(order.orderPrice);
        }, 0).toFixed(2)}</span>
      </p>

      {orderGroup.orders.map(order => {
        return <OrderCard order={order} />;
      })}
    </div>
  );
};

export default OrderGroup
