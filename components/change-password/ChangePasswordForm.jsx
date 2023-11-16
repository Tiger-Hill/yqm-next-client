"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordWhileLoggedIn } from "@/lib/redux/slices/passwordSlice";
import { AnimatePresence, motion } from "framer-motion";
import classes from "./ChangePasswordForm.module.scss";

import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import ButtonMui from "@/components/forms/ButtonMui";


const validate = (values) => {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Enter your current password";
  }

  if (!values.password) {
    errors.password = "Enter your password";
  } else if (values.password.trim().length < 6) {
    errors.password = "Must be at least 6 characters";
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = "Confirm your password";
  } else if (values.password.trim() !== values.passwordConfirmation.trim()) {
    errors.passwordConfirmation = "Doesn't match the password";
  }

  return errors;
};

const ChangePasswordForm = ({ lng }) => {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.rootReducer.password.notification);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validate,
    onSubmit: values => {
      // setIsSubmitting(true);

      console.error("values", values);
      dispatch(updatePasswordWhileLoggedIn(values));
    },
  });

  useEffect(() => {
    if (notification.flash_code === "UPDATE_PASSWORD_WHILE_LOGGED_IN_SUCCESS") {
      router.replace(`/${lng}/account`);
    }
  }, [notification.flash_code]);

  return (
    <section className={classes["form-container"]}>
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

        <h1>Change your password</h1>
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
        <InputMui
          required
          id="outlined-required currentPassword"
          name="currentPassword"
          type="password"
          label="Current password"
          helperText={
            formik.errors.currentPassword && formik.errors.currentPassword
          }
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={
            !!formik.touched.currentPassword && !!formik.errors.currentPassword
          }
          valid={
            !!formik.touched.currentPassword && !formik.errors.currentPassword
          }
          // defaultValue="currentPassword"
        />

        <InputMui
          required
          id="outlined-required password"
          name="password"
          type="password"
          label="New Password"
          helperText={formik.errors.password && formik.errors.password}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.password && !!formik.errors.password}
          valid={!!formik.touched.password && !formik.errors.password}
          // defaultValue="password"
        />

        <InputMui
          required
          id="outlined-required passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          label="Confirm New Password"
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
          // defaultValue="passwordConfirmation"
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
          disabled={
            !!formik.errors.currentPassword ||
            !!!formik.values.currentPassword ||
            !!formik.errors.password ||
            !!!formik.values.password ||
            !!formik.errors.passwordConfirmation ||
            !!!formik.values.passwordConfirmation
          }
          text="Change password"
          onClickHandler={() => {}}
        />
      </motion.form>
    </section>
  );
}

export default ChangePasswordForm
