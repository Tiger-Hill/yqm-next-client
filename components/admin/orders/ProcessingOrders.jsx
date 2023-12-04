"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, getAllOrdersCsv } from "@/lib/redux/slices/adminSlice";
import Image from "next/image";

import OrderRow from "./OrderRow";
import ButtonMui from "@/components/forms/ButtonMui";

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import UploadFileIcon from "@mui/icons-material/UploadFile";



import classes from "./../AdminDashboard.module.scss";

const ProcessingOrders = ({ lng }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.rootReducer.admin);

  const [pendingOrders, setPendingOrders] = useState(null);

  const redirectToAllOrdersHandler = () => {
    router.push(`/${lng}/admin_dashboard/orders`);
  }

  const downloadOrdersSvgHandler = () => {
    dispatch(getAllOrdersCsv());
  }

  const redirectToUpdateOrdersWithCsvPage = () => {
    router.push(`/${lng}/admin_dashboard/update_bulk_orders`);
  }

  // * We get all orders
  useEffect(() => {
    dispatch(getAdminOrders());
  }, []);

  // * We filter the orders to get only the pending ones
  useEffect(() => {
    if (orders) {
      const pendingOrders = orders.filter(order => !["Delivered, Cancelled"].includes(order.orderStatus));
      setPendingOrders(pendingOrders);
    }
  }, [orders]);

  console.log(pendingOrders);

  return (
    <div className={classes["processing-orders-container"]}>
      <h3>Processing Orders</h3>

      <div className={classes["processing-orders"]}>
        {pendingOrders &&
          pendingOrders.map((order, i) => (
            <OrderRow key={`${order.slug}${i}`} order={order} rowIndex={i} />
          ))}
      </div>

      <div className={classes["actions-container"]}>
        <FormatListBulletedIcon
          onClick={() => redirectToAllOrdersHandler()}
        />
        <Image
          src="/SVGS/csv-icon.png"
          alt="CSV icon"
          width={3000}
          height={3000}
          onClick={() => downloadOrdersSvgHandler()}
        />
        <UploadFileIcon
          onClick={() => redirectToUpdateOrdersWithCsvPage()}
        />
      </div>
    </div>
  );
};

export default ProcessingOrders;

{/* <ButtonMui
  width="100%"
  height="2.5rem"
  marginTop="2rem"
  fontSize="1.7rem"
  backgroundColor="#f8ae01"
  color="white"
  disabledBakcgroundColor="#DCDCDC"
  disabledColor="white"
  type="button"
  disabled={false}
  text="View all orders"
  onClickHandler={() => redirectToAllOrdersHandler()}
/> */}
