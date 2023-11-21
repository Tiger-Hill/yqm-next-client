import Products from "./products/Products";
import ProcessingOrders from "./orders/ProcessingOrders";
import Prices from "./prices/Prices";


import classes from "./AdminDashboard.module.scss";

const AdminDashboard = ({ lng }) => {
  return (
    <div className={classes["admin-dashboard-container"]}>
      {/* <h1>admin dashboard</h1> */}
      <Products lng={lng} />

      {/* <div className={classes["orders-prices-container"]}> */}
        <ProcessingOrders lng={lng} />
        <Prices lng={lng} />
      {/* </div> */}
    </div>
  );
}

export default AdminDashboard
