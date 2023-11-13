"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "@/lib/redux/slices/authSlice";

import Image from "next/image";
import classes from "./SignupForm.module.scss";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";

import InputMui from "@/components/forms/InputMui";
import SelectMui from "@/components/forms/SelectMui";
import ButtonMui from "@/components/forms/ButtonMui";
import Link from "next/link";


// ! VALIDATION FOR THE FORMIK FORM
const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Select a title";
  } else if (values.title !== "Mr" && values.title !== "Ms") {
    errors.title = "Please select a valid title";
  }

  if (!values.firstName) {
    errors.firstName = "Enter your first name";
  } else if (values.firstName.trim().length < 1) {
    errors.firstName = "Spaces are not valid characters";
  } else if (/\*/g.test(values.firstName)) {
    errors.firstName = "Forbidden special character detected, retry with a valid first name";
  }

  if (!values.lastName) {
    errors.lastName = "Enter your last name";
  } else if (values.lastName.trim().length < 1) {
    errors.lastName = "Spaces are not valid characters";
  } else if (/\*/g.test(values.lastName)) {
    errors.lastName = "Forbidden special character detected, retry with a valid last name";
  }

  if (!values.email) {
    errors.email = "Enter your email address";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Enter your password";
  } else if (values.password.trim().length < 6) {
    errors.password = "Must be at least 6 characters";
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = "Confirm your password";
  } else if (
    values.password.trim() !== values.passwordConfirmation.trim()
  ) {
    errors.passwordConfirmation = "Doesn't match the password";
  }

  return errors;
};

const SignupForm = ({ lng }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate,
    onSubmit: values => {
      // setIsSubmitting(true);

      console.error("values", values);

      // ! DISPATCH LOGIN ACTION
      dispatch(signUp(values));
    },
  });

  const titleOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
  ];

  return (
    <section className={classes["auth-container"]}>
      <motion.div
        className={classes["auth-logo"]}
        transition={{ duration: 0.25 }}
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: "auto" }}
      >
        <Image
          src="/LOGOS/YQM-logo.svg"
          alt="YQM colored logo"
          width={150}
          height={105}
        />

        <h1>Signup</h1>
      </motion.div>

      <motion.form
        className={`${classes["formik-form"]}`}
        onSubmit={formik.handleSubmit}
        key="login-form"
        data-testid="login-formik-form"
        transition={{ duration: 0.25 }}
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: "auto" }}
      >
        <SelectMui
          required={true}
          id="outlined-required title"
          name="title"
          // label="Title"
          helperText={formik.errors.title && formik.errors.title}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.title && !!formik.errors.title}
          valid={!!formik.touched.title && !formik.errors.title}
          labelId="title-label"
          value={formik.values.title}
          emptyValue={false}
          emptyValueText={null}
          menuItems={titleOptions}
          inputLabel={"Title"}
          // defaultValue={formik.touched.title}
        />

        <InputMui
          required={true}
          id="outlined-required firstName"
          name="firstName"
          type="firstName"
          label="First name"
          helperText={formik.errors.firstName && formik.errors.firstName}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.firstName && !!formik.errors.firstName}
          valid={!!formik.touched.firstName && !formik.errors.firstName}
          // defaultValue="Email"
        />

        <InputMui
          required={true}
          id="outlined-required lastName"
          name="lastName"
          type="lastName"
          label="Last name"
          helperText={formik.errors.lastName && formik.errors.lastName}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.lastName && !!formik.errors.lastName}
          valid={!!formik.touched.lastName && !formik.errors.lastName}
          // defaultValue="Email"
        />

        <InputMui
          required={true}
          id="outlined-required email"
          name="email"
          type="email"
          label="Email"
          helperText={formik.errors.email && formik.errors.email}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.email && !!formik.errors.email}
          valid={!!formik.touched.email && !formik.errors.email}
          // defaultValue="Email"
        />

        <InputMui
          required={true}
          id="outlined-required password"
          name="password"
          type="password"
          label="Password"
          helperText={formik.errors.password && formik.errors.password}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.password && !!formik.errors.password}
          valid={!!formik.touched.password && !formik.errors.password}
          // defaultValue="Password"
        />

        <InputMui
          required={true}
          id="outlined-required passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          label="Password Confirmation"
          helperText={
            formik.errors.passwordConfirmation &&
            formik.errors.passwordConfirmation
          }
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={
            !!formik.touched.passwordConfirmation &&
            !!formik.errors.passwordConfirmation
          }
          valid={
            !!formik.touched.passwordConfirmation &&
            !formik.errors.passwordConfirmation
          }
          // defaultValue="Password"
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
          onClickHandler={() => {}}
          // disabled={!isSubmitDisabled}
          disabled={false}
          text="Signup"
          // size="large"
        />

        <div className={classes["alternative-auth-links-container"]}>
          <p className={classes["alternative-auth-link"]}>
            Already have an account? <Link href={`/${lng}/login`}>Login</Link>
          </p>
        </div>
      </motion.form>
    </section>
  );
}

export default SignupForm
