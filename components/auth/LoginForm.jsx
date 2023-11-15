"use client";

import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/lib/redux/slices/authSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import Image from "next/image";
import classes from './LoginForm.module.scss'

import InputMui from "@/components/forms/InputMui";
import ButtonMui from "@/components/forms/ButtonMui";

// ? Below is for checkbox (Create a component for it?)
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import WarningIcon from "@mui/icons-material/Warning";


// ! VALIDATION FOR THE FORMIK FORM
const validate = values => {

  console.log("values", values);
  const errors = {};

  if (!values.email) {
    errors.email = "Enter your email address";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Enter your password";
  }

  return errors;
};

const LoginForm = ({ lng }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  //  const isLoggedIn = useSelector(state => state.rootReducer.auth.isLoggedIn);
  const { notification } = useSelector(state => state.rootReducer.auth);

  const formik = useFormik({
    initialValues: {
      // email: userEmailCookie ? userEmailCookie : "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: values => {
      // setIsSubmitting(true);

      console.error("values", values);

      // * If the remember me checkbox is ticked, we save the user email in the user email cookie
      // if (isRememberMe) {
      //   Cookies.set("userEmail", values.email);
      // }

      // ! DISPATCH LOGIN ACTION
      dispatch(
        signIn({ email: values.email, password: values.password }, isRememberMe)
      );
    },
  });

  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleChange = e => {
    setIsRememberMe(e.target.checked);
  };

  // * ACCOUNT LOCKED MANAGEMENT
  const [isAccountLocked, setIsAccountLocked] = useState("unlocked"); // ? ["unlocked", "lastAttempt", "locked"]
  useEffect(() => {
    if (notification?.flash_code === "SIGN_IN_SUCCESS") {
      // setIsSubmitting(false);
      // * If the user is logged in, we redirect him to the products page
      router.push(`/${lng}/products`);
    } else if (notification?.status === "error") {
      // setIsSubmitting(false)

      if (notification?.flash_code === "SIGN_IN_ONE_MORE_ATTEMPT_LEFT_ERROR") {
        setIsAccountLocked("lastAttempt");
      } else if (notification?.flash_code === "SIGN_IN_ACCOUNT_LOCKED_ERROR") {
        setIsAccountLocked("locked");
      }
    }
  }, [notification]);

  // ! Checkbox tick box styling
  const syledCheckBox = {
    color: "#7b00ff",

    // * The svg icon
    "& .MuiSvgIcon-root": {
      fontSize: "3rem",
    },

    // * When "checked"
    "&.Mui-checked": {
      color: "#7b00ff",
    },
  };

  // ! Checkbox text styling
  const formControlLabelStyle = {
    color: "#7b00ff",
    fontWeight: "400",

    // * The label (remember me)
    "& .MuiTypography-root": {
      fontSize: "2rem !important",
    },
  };

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

        <h1>Login</h1>
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
          required
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

        <FormControlLabel
          sx={formControlLabelStyle}
          control={
            <Checkbox
              defaultChecked
              sx={syledCheckBox}
              onChange={handleChange}
            />
          }
          label="Remember me"
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
            !!!formik.values.email ||
            !!formik.errors.email ||
            !!!formik.values.password ||
            !!formik.errors.password
          }
          text="Login"
          onClickHandler={() => {}}
        />

        {isAccountLocked === "lastAttempt" && (
          <p className={classes["last-attempt-message"]}>
            <WarningIcon />
            <br />
            You have one more attempt left before your account gets locked.
          </p>
        )}

        {isAccountLocked === "locked" && (
          <p className={classes["locked-message"]}>
            <WarningIcon />
            <br />
            Your account has been locked. We've sent you an email to unlock it.
          </p>
        )}

        <div className={classes["alternative-auth-links-container"]}>
          <p className={classes["alternative-auth-link"]}>
            Don't have an account yet?{" "}
            <Link href={`/${lng}/signup`}>Signup</Link>
          </p>

          <p className={classes["alternative-auth-link"]}>
            Forgot your password?{" "}
            <Link href={`/${lng}/users/forgot-password`}>Reset password</Link>
          </p>

          <p className={classes["alternative-auth-link"]}>
            Didn't receive account confirmation email?{" "}
            <Link href={`/${lng}/users/resend-confirmation-instructions`}>
              Resend account confirmation email
            </Link>
          </p>
        </div>
      </motion.form>
    </section>
  );
}

export default LoginForm
