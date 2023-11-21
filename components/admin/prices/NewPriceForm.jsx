"use client";

import { useDispatch, useSelector } from "react-redux";
import { createPrice } from "@/lib/redux/slices/adminSlice";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";

import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import SelectMui from "@/components/forms/SelectMui";
import DatePickerMui from "@/components/forms/DatePickerMui";
import ButtonMui from "@/components/forms/ButtonMui";
import CloseIcon from "@mui/icons-material/Close";

import modalClasses from "@/components/modals/Modal.module.scss";

const validate = values => {
  const errors = {};

  if (!values.currency) {
    errors.currency = "Please select a currency";
  } else if (!["SGD"].includes(values.currency)) {
    errors.currency = "Please select a valid currency";
  }

  if (!values.basePrice) {
    errors.basePrice = "Please enter a price";
  } else if (Number(values.basePrice) < 1) {
    errors.basePrice = "Price must be a positive value";
  } else if (!values.basePrice.match(/^\d+(\.\d+)?$/)) {
    errors.basePrice = "Price must be a valid number";
  }

  if (!values.pricingDate) {
    errors.pricingDate = "Please select a date";
  }
  // else {
  //   const today = new Date();
  //   const pricingDate = new Date(values.pricingDate);

  //   if (pricingDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
  //     errors.pricingDate = "You can't select a date in the past";
  //   }
  // }

  console.log(values);
  console.log(errors);

  return errors;
}

const NewPriceForm = ({ product, showNewPriceModalHandler }) => {
  const dispatch = useDispatch();
  // const { notification } = useSelector(state => state.rootReducer.admin);

  const formik = useFormik({
    initialValues: {
      currency: "SGD",
      basePrice: "",
      pricingDate: new Date(),
    },
    validate,
    onSubmit: values => {
      console.log(values);
      const price = {
        ...values,
        productId: product.slug,
      }

      dispatch(createPrice(price));
      showNewPriceModalHandler("close");
    },
  });
  return (
    <motion.div
      className={modalClasses.backdrop}
      onClick={() => showNewPriceModalHandler("close")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={modalClasses.content}
        onClick={e => e.stopPropagation()}
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
        transition={{ duration: 0.25 }}
      >
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={() => showNewPriceModalHandler("close")}
        />
        <Image
          src="/SVGS/add-price.svg"
          alt="plus icon for 'add a product'"
          width={200}
          height={200}
        />
        <h4>
          Add a new price for
          <br />
          <span className={modalClasses["product-name"]}>
            {product.productName}
          </span>
        </h4>

        <form onSubmit={formik.handleSubmit}>
          <SelectMui
            required={true}
            id="outlined-required currency"
            name="currency"
            // label="currency"
            helperText={formik.errors.currency && formik.errors.currency}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.currency && !!formik.errors.currency}
            valid={!!formik.touched.currency && !formik.errors.currency}
            labelId="currency-label"
            value={formik.values.currency}
            emptyValue={false}
            emptyValueText={null}
            menuItems={[
              { value: "SGD", label: "SGD" },
              // { value: "out of stock", label: "Out Of Stock" },
              // { value: "hidden", label: "Hidden" },
            ]}
            inputLabel={"Currency"}
            // defaultValue={formik.touched.currency}
          />

          <InputMui
            required={true}
            id="outlined-disabled basePrice"
            name="basePrice"
            type="text"
            label="Base price"
            // min={"1"}

            helperText={formik.errors.basePrice && formik.errors.basePrice}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.basePrice && !!formik.errors.basePrice}
            valid={!!formik.touched.basePrice && !formik.errors.basePrice}
            disabled={false}
            defaultValue={formik.values.basePrice}
          />

          <DatePickerMui
            inputName="pricingDate" // For DatePicker component
            require={true}
            id="outlined-disabled pricingDate"
            label={"Pricing date*"}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            value={formik.values.pricingDate}
            defaultValue={formik.values.pricingDate}
            formik={formik}
            disablePast={false}
            helperText={formik.errors.pricingDate && formik.errors.pricingDate}
          />

          <ButtonMui
            width="100%"
            height="5rem"
            marginTop="2rem"
            fontSize="1.7rem"
            backgroundColor="#f8ae01"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="submit"
            disabled={false}
            text="Add this price"
            onClickHandler={() => {}}
          />
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewPriceForm;
