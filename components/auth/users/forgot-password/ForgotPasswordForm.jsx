"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordInstructions } from "@/lib/redux/slices/passwordSlice";
import { AnimatePresence, motion } from "framer-motion";
import classes from "./ForgotPasswordForm.module.scss";

import Link from "next/link";
import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import ButtonMui from "@/components/forms/ButtonMui";


const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Enter your email address";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const ForgotPasswordForm = ({ lng }) => {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.rootReducer.password.notification);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: values => {
      dispatch(sendForgotPasswordInstructions(values.email));
    },
  });

  return (
    <section className={classes["auth-container"]}>
      <motion.div
        className={classes["auth-logo"]}
        transition={{ duration: 0.25 }}
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: "auto" }}
      >
        {/* <Image
          src="/LOGOS/YQM-logo.svg"
          alt="YQM colored logo"
          width={150}
          height={105}
        /> */}

        <h1>Forgot password?</h1>
      </motion.div>

      <motion.form
        className={`${classes["formik-form"]}`}
        onSubmit={formik.handleSubmit}
        key="reset-password-form"
        data-testid="reset-password-formik-form"
        transition={{ duration: 0.25 }}
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: "auto" }}
      >
        <InputMui
          required
          id="outlined-required email"
          name="email"
          type="email"
          label="Email"
          helperText={formik.errors.email && formik.errors.email}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.email && !!formik.errors.email}
          valid={!!formik.touched.email && !formik.errors.email}
          // defaultValue="email"
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
          disabled={!!!formik.values.email || !!formik.errors.email}
          text="Send instructions"
          onClickHandler={() => {}}
        />

        <div className={classes["alternative-auth-links-container"]}>
          <p className={classes["alternative-auth-link"]}>
            Back to <Link href={`/${lng}/login`}>Login</Link>
          </p>
        </div>
      </motion.form>
    </section>
  );
}

export default ForgotPasswordForm
