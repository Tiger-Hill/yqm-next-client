import AllOrders from "@/components/admin/orders/AllOrders";

const OrderPage = ({ params: { lng } }) => {
  return <AllOrders lng={lng} />;
};

export default OrderPage;
