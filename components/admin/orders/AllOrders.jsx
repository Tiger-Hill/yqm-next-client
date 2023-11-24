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
      {orders &&
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
                <td>{order.orderType}</td>
                <td>{order.orderDate}</td>

                <td>
                  <ul>
                    {order.orderProducts.map((obj, i) => {
                      const { orderProduct, product } = obj;
                      return (
                        <li key={`${obj.product.slug}${i}`}>
                          {product.productName} - {order.orderCurrency} {orderProduct.orderPrice} - x{Number(orderProduct.orderQuantity).toFixed()}
                        </li>
                      )
                    })}
                  </ul>
                </td>

                <td>
                  {order.orderProducts.reduce((acc, obj) => {
                    const { orderProduct } = obj;
                    return acc + orderProduct.orderPrice * orderProduct.orderQuantity;
                  }, 0).toFixed(2)}
                </td>

                <td>{order.slug}</td>
                <td>{order.orderStatus}</td>

                {order.orderStatus === "Processing" &&
                  <OrderActions order={order} />
                }
              </tr>
            ))}
          </tbody>
        </table>
      }
    </>
  )
}

export default AllOrders
