"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { publishAllPrices, getAdminProducts, clearPriceToEdit, clearPricesTableData } from "@/lib/redux/slices/adminSlice";

import ProductPricesTable from "./ProductPricesTable";

import classes from "./../AdminDashboard.module.scss";
import ButtonMui from "@/components/forms/ButtonMui";

const Prices = ({ lng }) => {
  const dispatch = useDispatch();
  const { notification } = useSelector(state => state.rootReducer.admin);
  const [isPublished, setIsPublished] = useState(false);

  const publishAllPricesHandler = () => {
    dispatch(publishAllPrices());
  };

  const fetchAllProductsHandler = () => {
    // ? Once the publishing action is successfull, we fetch all products again to update the products' prices
    dispatch(getAdminProducts());
    // ? We reset the value of this state to false so we don't get stuck in a useEffect loop
    setIsPublished(false);
  };

  useEffect(() => {
    //  ? We wait for the notif to be publish success
    if (notification.flash_code === "PUBLISH_ALL_PRICES_SUCCESS") {
      // ? We change the value of this state to trigger next useEffect
      setIsPublished(true);
    }
  }, [notification])

  // ? Gets triggerd when the publishing action is successfull
  useEffect(() => {
    // ? We fetch all products again to update the products' prices
    if (isPublished) {
      // ? We call the handler to refetch the products
      fetchAllProductsHandler();
    }
  }, [isPublished])

  // * We make sure the priceToEdit is reset to null when the component mounts
  useLayoutEffect(() => {
    dispatch(clearPriceToEdit());
    dispatch(clearPricesTableData());
  }, [])

  return (
    <div className={classes["prices-container"]}>
      <h3>Prices</h3>

      <ProductPricesTable lng={lng} />

      {/* <div className={classes["publish-all-btn-container"]}> */}
        <ButtonMui
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
          text="Publish all pending prices (if any)"
          onClickHandler={() => publishAllPricesHandler()}
        />
      {/* </div> */}
    </div>
  );
};

export default Prices;
