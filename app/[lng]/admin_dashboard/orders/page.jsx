import PageTemplate from "@/components/UI/PageTemplate";
import AllOrders from "@/components/admin/orders/AllOrders";
import ordersAdmin from "@/public/SVGS/orders-admin.svg";

const OrderPage = ({ params: { lng } }) => {
  return (
    <PageTemplate
      pageImg={ordersAdmin}
      pageImgAlt={"A dollar sign with a list"}
    >
      <h2>Orders Page</h2>

      <AllOrders lng={lng} />
    </PageTemplate>
  );
};

export default OrderPage;
