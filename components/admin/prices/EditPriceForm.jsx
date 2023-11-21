"use client";

import { useDispatch, useSelector } from "react-redux";
import { getPrice, updatePrice, deletePrice } from "@/lib/redux/slices/adminSlice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const EditPriceForm = ({ lng, priceSlug }) => {
  const dispatch = useDispatch();
  const { priceToEdit } = useSelector(state => state.rootReducer.admin);

  useEffect(() => {
    if (!priceToEdit) dispatch(getPrice(priceSlug));
  }, [priceToEdit]);

  return (
    <>
      {priceToEdit && <EditPriceFormContent lng={lng} price={priceToEdit} />}
    </>
  );
};

const EditPriceFormContent = ({ lng, price }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const deletePriceHandler = () => {
    dispatch(deletePrice(price.slug));
  };

  const formik = useFormik({
    initialValues: {
      currency: price.currency,
      basePrice: Number(price.basePrice).toFixed(2),
      pricingDate: new Date(price.pricingDate),
      published: price.published.toString(),
    },
    validate,
    onSubmit: values => {
      const priceData = {
        ...values,
        slug: price.slug,
      }

      console.log(priceData);
      dispatch(updatePrice(priceData));
      router.push(`/${lng}/admin_dashboard`);
    },
  });
  return (
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

      <SelectMui
        required={true}
        id="outlined-required published"
        name="published"
        // label="published"
        helperText={formik.errors.published && formik.errors.published}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.published && !!formik.errors.published}
        valid={!!formik.touched.published && !formik.errors.published}
        labelId="published-label"
        value={formik.values.published}
        emptyValue={false}
        emptyValueText={null}
        menuItems={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        inputLabel={"Published"}
        // defaultValue={formik.touched.published}
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
        text="Confirm changes"
        onClickHandler={() => {}}
      />

      <ButtonMui
        width="100%"
        height="5rem"
        marginTop="2rem"
        fontSize="1.7rem"
        backgroundColor="#FF302E"
        color="white"
        disabledBakcgroundColor="#DCDCDC"
        disabledColor="white"
        type="button"
        disabled={false}
        text="Delete this price"
        onClickHandler={() => deletePriceHandler()}
      />
    </form>
  );
};

export default EditPriceForm;
