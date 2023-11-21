import Orders from "@/components/orders/Orders";

const OrdersPage = ({ params: { lng } }) => {
  return <Orders lng={lng} />;
};

export default OrdersPage;
