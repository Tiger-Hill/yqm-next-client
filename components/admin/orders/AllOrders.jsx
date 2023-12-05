"use client";

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAdminOrders } from "@/lib/redux/slices/adminSlice";

import OrderActions from "./OrderActions";

import classes from "./AllOrders.module.scss";

const AllOrders = ({ lng }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.rootReducer.admin);

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [])

  return (
    <>
      {orders && (
        <table className={classes["all-orders-table"]}>
          <thead>
            <tr>
              {/* <th>From</th> */}
              <th>Type</th>
              <th>Date</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <tr key={`${order.slug}${i}`}>
                <td>{order.orders[0].orderType}</td>
                <td>{order.orders[0].orderDate}</td>

                <td>
                  <ul>
                    {order.orders.map((order, i) => {
                      // const { order, product } = obj;
                      return (
                        <li key={`${order.product.slug}${i}`}>
                          {order.product.productName} - {order.orderCurrency} 
                          {order.orderPrice} - x
                          {Number(order.orderQuantity).toFixed()}
                           - {order.slug}
                        </li>
                      );
                    })}
                  </ul>
                </td>

                <td>
                  {order.orders
                    .reduce((acc, order) => {
                      // const { orderProduct } = order;
                      return acc + order.orderPrice * order.orderQuantity;
                    }, 0)
                    .toFixed(2)}
                </td>

                <td>{order.paymentId}</td>
                <td>
                  <ul>
                    {order.orders.map((order, i) => {
                      // const { order, product } = obj;
                      return (
                        <li key={`${i}${order.product.slug}`}>
                          {order.orderStatus} 
                        </li>
                      );
                    })}
                  </ul>
                </td>

                {/* {order.orderStatus === "Processing" && ( */}

                <ul>
                  {order.orders.map((order, i) => {
                    // const { order, product } = obj;
                    return (
                      <li key={`${i}${order.product.slug}`}>
                        <OrderActions order={order} />
                      </li>
                    );
                  })}
                </ul>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AllOrders
