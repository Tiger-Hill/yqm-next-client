import Products from "./products/Products";
import ProcessingOrders from "./orders/ProcessingOrders";
import Prices from "./prices/Prices";
import Wishes from "./wishes/Wishes";


import classes from "./AdminDashboard.module.scss";

const AdminDashboard = ({ lng }) => {
  return (
    <div className={classes["admin-dashboard-container"]}>
      <Products lng={lng} />
      <ProcessingOrders lng={lng} />
      <Prices lng={lng} />
      <Wishes lng={lng} />
    </div>
  );
}

export default AdminDashboard
