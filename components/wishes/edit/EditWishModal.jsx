"use client";

import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getUserWish, clearUserWishToShow, updateWish } from "@/lib/redux/slices/wishSlice";
import { motion } from "framer-motion";

import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import ButtonMui from "@/components/forms/ButtonMui";
import CloseIcon from "@mui/icons-material/Close";

import modalClasses from "@/components/modals/Modal.module.scss";

const validate = values => {
  const errors = {};

  if (!values.wishQuantity) {
    errors.wishQuantity = "Enter a number of units";
  } else if (values.wishQuantity < 1) {
    errors.wishQuantity = "Enter a valid number of units (≥ 1)";
  }
  // else if (values.changeInNumberOfUnits > maxChangeInNumberOfUnits) {
  //   errors.changeInNumberOfUnits = "You do not own enough units";
  // }

  if (!values.wishPrice) {
    errors.wishPrice = "Enter a price";
  } else if (values.wishPrice < 1) {
    errors.wishPrice = "Enter a valid number of units (≥ 1)";
  }

  return errors;
};

// ! CONTENT
const EditWishForm = ({ closeModal, product, userWish, lng }) => {
  const dispatch = useDispatch();
  const backdropRef = useRef(null);

  const closeModalHandler = (e, isCloseButton = false) => {
    if (backdropRef.current === e.target || isCloseButton) {
      closeModal();
    }
  };

  // TODO: GET INFO OF THE EXISTING WISH WHEN MODAL OPENS UP

  const formik = useFormik({
    initialValues: {
      // wishQuantity: Number(userWish.wishedQuantity).toFixed() || 1,
      // wishPrice: Number(userWish.wishedPrice).toFixed(2) || 1,
      wishQuantity: userWish?.wishQuantity || 1,
      wishPrice: userWish?.wishPrice || 1,
      comments: userWish?.comments || "",
    },
    validate,
    onSubmit: values => {
      const wish = {
        // productId: userWishToShow.product.slug,
        ...values,
      };

      dispatch(updateWish(userWish.slug, wish));
      // dispatch(addWishValuesToProduct({ productId: product.slug, wishedQuantity: wish.wishQuantity }));
      closeModal();
    },
  });

  return (
    <div
      className={modalClasses["backdrop"]}
      onClick={e => closeModalHandler(e)}
      data-testid="backdrop-element"
      ref={backdropRef}
    >
      <div className={modalClasses["content"]}>
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={e => closeModalHandler(e, true)}
        />
        <h2>Make a wish!</h2>

        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
          alt={product.productName}
          width={150}
          height={150}
          key={product.images[0]}
        />

        <motion.form
          className={`${modalClasses["formik-form"]}`}
          onSubmit={formik.handleSubmit}
          key="login-form"
          data-testid="login-formik-form"
          transition={{ duration: 0.25 }}
          initial={{ opacity: 0, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "auto" }}
        >
          <InputMui
            required
            id="outlined-required wishQuantity"
            name="wishQuantity"
            type="number"
            min="1"
            max={Infinity}
            label="Wished quantity"
            helperText={
              formik.errors.wishQuantity && formik.errors.wishQuantity
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.wishQuantity && !!formik.errors.wishQuantity
            }
            valid={
              !!formik.touched.wishQuantity && !formik.errors.wishQuantity
            }
            disabled={false}
            defaultValue={formik.values.wishQuantity}
          />

          <InputMui
            required
            id="outlined-required wishPrice"
            name="wishPrice"
            type="number"
            min="1"
            max={Infinity}
            label="Wished price"
            helperText={formik.errors.wishPrice && formik.errors.wishPrice}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.wishPrice && !!formik.errors.wishPrice}
            valid={!!formik.touched.wishPrice && !formik.errors.wishPrice}
            disabled={false}
            defaultValue={formik.values.wishPrice}
          />

          <InputMui
            required={false}
            id="outlined-disabled comments"
            name="comments"
            type="text"
            label="Comments"
            helperText={formik.errors.comments && formik.errors.comments}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.comments && !!formik.errors.comments}
            valid={!!formik.touched.comments && !formik.errors.comments}
            disabled={false}
            defaultValue={formik.values.comments}
          />

          <ButtonMui
            width="100%"
            height="5rem"
            marginTop="2rem"
            fontSize="1.7rem"
            backgroundColor="#7b00ff"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="submit"
            disabled={
              !!!formik.values.wishQuantity ||
              !!formik.errors.wishQuantity ||
              !!!formik.values.wishPrice ||
              !!formik.errors.wishPrice
            }
            text="Confirm wish changes"
            onClickHandler={() => {}}
          />
        </motion.form>
      </div>
    </div>
  );
};

const EditWishModal = ({ closeModal, product, userWish, lng }) => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { userWishToShow } = useSelector(state => state.rootReducer.wish);

  useEffect(() => {
    setMounted(true);
  }, []);

   console.log("userWishToShow", userWishToShow);
   useEffect(() => {
     dispatch(getUserWish(userWish.slug));
   }, []);

   // ! CLEAR USER WISH TO SHOW WHEN USER LEAVES THE PAGE
   useEffect(() => {
     return () => {
       dispatch(clearUserWishToShow());
     };
   }, []);

  return mounted && userWishToShow
    ? ReactDOM.createPortal(
        <EditWishForm
          closeModal={closeModal}
          product={product}
          userWish={userWishToShow}
          lng={lng}
        />,
        document.body
      )
    : null;
}

export default EditWishModal
