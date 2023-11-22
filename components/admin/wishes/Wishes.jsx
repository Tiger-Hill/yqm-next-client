"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientWishesProducts } from "@/lib/redux/slices/adminSlice";

import WishCard from "./WishCard";
import classes from "./../AdminDashboard.module.scss";

const Wishes = ({ x ,lng }) => {
  const dispatch = useDispatch();
  const { clientsWishesProducts } = useSelector(state => state.rootReducer.admin);

  useEffect(() => {
    dispatch(getClientWishesProducts());
  }, []);

  return (
    <div className={classes["client-wishes-container"]}>
      <h3>User Wishes</h3>

      {clientsWishesProducts && clientsWishesProducts.map((product, i) => (
        <WishCard key={`${product.productName}-${i}`} product={product} lng={lng} index={i} />
      ))}
    </div>
  );
};

export default Wishes;
