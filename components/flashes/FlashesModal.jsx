"use client";

import { createPortal } from "react-dom";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

import classes from "./FlashesModal.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { flashNotification as resetAuthNotif } from "@/lib/redux/slices/authSlice";
import { flashNotification as resetProductNotif } from "@/lib/redux/slices/productSlice";
import { flashNotification as resetUserDetailNotif } from "@/lib/redux/slices/userDetailSlice";
import { flashNotification as resetOrderNotif } from "@/lib/redux/slices/orderSlice";
import { flashNotification as resetPasswordNotif } from "@/lib/redux/slices/passwordSlice";
import { flashNotification as resetBasketNotif } from "@/lib/redux/slices/basketSlice";
import { flashNotification as resetTransactionNotif } from "@/lib/redux/slices/transactionSlice";
import { flashNotification as resetAdminNotif } from "@/lib/redux/slices/adminSlice";

const Flashes = () => {
  const dispatch = useDispatch();
  // // const pathname = usePathname();
  const [showFlash, setShowFlash] = useState(false);
  const [flashType, setFlashType] = useState(null);
  const [flashText, setFlashText] = useState(null);
  const flashTimers = { success: 5000, info: 10000, danger: 10000 };

  const authNotification = useSelector((state) => state.rootReducer.auth.notification);
  const productNotification = useSelector((state) => state.rootReducer.product.notification);
  const userDetailsNotification = useSelector((state) => state.rootReducer.userDetail.notification);
  const orderNotification = useSelector((state) => state.rootReducer.order.notification);
  const passwordNotification = useSelector((state) => state.rootReducer.password.notification);
  const basketNotification = useSelector((state) => state.rootReducer.basket.notification);
  const transactionNotification = useSelector((state) => state.rootReducer.transaction.notification);
  const adminNotification = useSelector((state) => state.rootReducer.admin.notification);

  const allNotifications = [ authNotification, productNotification, userDetailsNotification, orderNotification, passwordNotification, basketNotification, transactionNotification, adminNotification ];

  useEffect(() => {
    let notification;
    let timer;

    if (allNotifications.some((notification) => (notification.status === "error") && (ERROR_CODES.hasOwnProperty(notification.flash_code)))) {
      notification = allNotifications.find((notification) => notification.status === "error");
      setFlashType("danger");
      setFlashText(ERROR_CODES[notification.flash_code]);
      setShowFlash(true);
    } else if (allNotifications.some((notification) => (notification.status === "success") && (SUCCESS_CODES.hasOwnProperty(notification.flash_code)))) {
      notification = allNotifications.find((notification) => (notification.status === "success") && (notification?.flash_code !== "GENERAL_SUCCESS") && (notification?.flash_code !== undefined));
      // console.log(notification);
      setFlashType("success");
      setFlashText(SUCCESS_CODES[notification.flash_code]);
      setShowFlash(true);

    } else if (allNotifications.some((notification) => (notification.status === "info") && (INFO_CODES.hasOwnProperty(notification.flash_code)))) {
      notification = allNotifications.find((notification) => notification.status === "info");
      setFlashType("info");
      setFlashText(INFO_CODES[notification.flash_code]);
      setShowFlash(true);
    }

    // ! WE CHANGE THE STATUS FROM "error" / "success" / "info" TO "flashed"
    notification?.slice === "auth" && dispatch(resetAuthNotif());
    notification?.slice === "product" && dispatch(resetProductNotif());
    notification?.slice === "userDetail" && dispatch(resetUserDetailNotif());
    notification?.slice === "order" && dispatch(resetOrderNotif());
    notification?.slice === "password" && dispatch(resetPasswordNotif());
    notification?.slice === "basket" && dispatch(resetBasketNotif());
    notification?.slice === "transaction" && dispatch(resetTransactionNotif());
    notification?.slice === "admin" && dispatch(resetAdminNotif());

    return () => {
      clearTimeout(timer);
    }
  }, [allNotifications]);


  useEffect(() => {
    if (showFlash) {
      const timer = setTimeout(() => {
        setShowFlash(false);
      }, flashTimers[flashType]);

      return () => clearTimeout(timer);
    }
  })

  const handleFlashClose = () => {
    setShowFlash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showFlash && flashType === "success" && (
          <motion.div
            onClick={handleFlashClose}
            className={`${classes["flash-container"]} ${classes["flash-success"]}`}
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
          >
            <CheckCircleIcon />
            <p>{flashText}</p>
          </motion.div>
        )}

        {showFlash && flashType === "danger" && (
          <motion.div
            onClick={handleFlashClose}
            className={`${classes["flash-container"]} ${classes["flash-danger"]}`}
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
          >
            <WarningIcon />
            <p>{flashText}</p>
          </motion.div>
        )}

        {showFlash && flashType === "info" && (
          <motion.div
            onClick={handleFlashClose}
            className={`${classes["flash-container"]} ${classes["flash-info"]}`}
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
          >
            <InfoIcon />
            <p>{flashText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const FlashModal = ({ flashType, flashText }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  },[])

  return mounted
    ? createPortal(
        <Flashes flashType={flashType} flashText={flashText} />,
        document.body
      )
    : null;
};

export default FlashModal;

// ! =============================== FLASH CODES ===============================
const INFO_CODES = {
  // // ? AUTH SLICE

  // ? USER DETAILS SLICE
  USER_DETAIL_SECTION_INCOMPLETE: "You first need to complete this section.",

  // ? PASSWORD SLICE
  FORGOT_PASSWORD_INFO: "If there is an email associated to this account, you will receive an email with instructions on resetting your password. If it doesn't arrive, be sure to check your spam folder.",
  RESEND_CONFIRMATION_INSTRUCTIONS_SUCCESS: "Successfully resent the confirmation instructions to the provided email.",
};

const ERROR_CODES = {
  GENERAL_ERROR: "An unexpected error occurred. Try again or contact the support.",

  // ? AUTH SLICE
  SIGNUP_ERROR: "Something went wrong while signing up. Please try again later or contact the support.",
  SIGNUP_EMAIL_ALREADY_TAKEN_ERROR: "This email is already taken.",
  SIGN_IN_WRONG_CREDENTIALS_ERROR: "We were unable to find an account with those credentials.",
  SIGN_OUT_ERROR: "Something went wrong while signing out. Please try again or contact the support.",
  UNLOCK_ACCOUNT_ERROR: "Something went wrong while unlocking your account. Please try again or contact the support.",
  SIGN_IN_EMAIL_NOT_CONFIRMED_ERROR: "This email is not confirmed. Please check your inbox for the confirmation email.",
  SIGN_IN_ONE_MORE_ATTEMPT_LEFT_ERROR: "You have one more attempt left before your account is locked.",
  SIGN_IN_ACCOUNT_LOCKED_ERROR: "Your account has been locked. Please check your inbox to find out how to get unlocked.",

  // ? USER DETAIL SLICE
  USER_DETAIL_UPDATE_ERROR: "An error occured while updating your user details.",

  // ? INVESTOR STATEMENT SLICE // NEVER USED
  // Rails will be sending out the meta message: "Fund Manager Organization not found. Please check and try again."
  // INVESTOR_STATEMENT_FUND_MANAGER_ORGANIZATION_ERROR: "An error occured while finding the support organization.",

  // ? PASSWORD SLICE
  // * Below needed to not give away if wether the email is already used or not
  // RESEND_CONFIRMATION_INSTRUCTIONS_ERROR: "An error occured while resending the confirmation instructions. Please try again later or contact the support.",
  CONFIRM_ACCOUNT_ERROR: "An error occured while confirming your account. Please try again later or contact the support.",
  UPDATE_PASSWORD_ERROR: "An error occured while updating your password. Please try again later or contact the support.",
  UPDATE_PASSWORD_WHILE_LOGGED_IN_ERROR: "An error occured while updating your password. Please try again later or contact the support.",
  UPDATE_PASSWORD_WHILE_LOGGED_IN_CURRENT_PASSWORD_ERROR: "The current password you entered is incorrect.",

  // ? ORDER SLICE
  SELLING_ORDER_CREATE_ERROR: "An error occured while creating your sell order. Please try again later or contact the support.",
  ORDER_CREATE_ERROR: "An error occured while creating your order. Please try again later or contact the support.",

  // ? ADMIN SLICE
  GET_ALL_ADMIN_PRODUCTS_ERROR: "An error occured while fetching all admin products. Please try again later or contact the support.",
  CREATE_PRODUCT_ERROR: "An error occured while creating your product.",
  UPDATE_PRODUCT_ERROR: "An error occured while updating your product.",
  DELETE_PRODUCT_ERROR: "An error occured while deleting your product. This product most likely has price(s) associated to it.",
  CREATE_PRICE_ERROR: "An error occured while creating your price.",
  MARK_ORDER_COMPLETED_ERROR: "An error occured while marking this order as completed.",
  MARK_ORDER_CANCELLED_ERROR: "An error occured while marking this order as cancelled.",
  PERSIST_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_ERROR: "An error occured while persisting the CSV file content to update the orders.",
  GET_ALL_ORDERS_CSV_ADMIN_NO_DATA_ERROR: "There is no existing orders. Impossible to generate a CSV file.",
  GET_ALL_ORDERS_FOR_PRODUCT_CSV_ADMIN_NO_DATA_ERROR: "There is no existing orders for this product. Impossible to generate a CSV file.",

  // ? PRODUCT SLICE
  CLIENT_CREATE_PRODUCT_ERROR: "An error occured while creating your product.",

  // ? PRICES
  UPDATE_PRICE_ERROR: "An error occured while updating your price.",
  DELETE_PRICE_ERROR: "An error occured while deleting your price.",
}

const SUCCESS_CODES = {
  // ? AUTH SLICE
  SIGN_UP_SUCCESS:
    "Successfully signed up! Click the link in the email we just sent you to verify your account.",
  SIGN_IN_SUCCESS: "Successfully signed in!",
  SIGN_OUT_SUCCESS: "Successfully signed out.",
  AUTO_SIGN_OUT_SUCCESS: "Signed out due to inactivity.",
  UNLOCK_ACCOUNT_SUCCESS: "Successfully unlocked your account.",

  // ? USER DETAIL SLICE
  USER_DETAIL_UPDATE_SUCCESS: "Successfully updated your user details.",

  // ? PASSWORD SLICE
  CONFIRM_ACCOUNT_SUCCESS: "Successfully confirmed your account.",
  UPDATE_PASSWORD_SUCCESS: "Successfully updated your password.",
  UPDATE_PASSWORD_WHILE_LOGGED_IN_SUCCESS:
    "Successfully updated your password.",

  // ? ORDER SLICE
  SELLING_ORDER_CREATE_SUCCESS: "Sell order successfully created.",
  ORDER_CREATE_SUCCESS:
    "Order successfully created. We're now processing your order.",

  // ? ADMIN SLICE
  CREATE_PRODUCT_SUCCESS: "Product successfully created.",
  CREATE_PRODUCT_SUCCESS: "Product successfully created.",
  UPDATE_PRODUCT_SUCCESS: "Product successfully updated.",
  DELETE_PRODUCT_SUCCESS: "Product successfully deleted.",
  CREATE_PRICE_SUCCESS: "Price successfully created. You now have to publish it in order for it to be visible to the public (you included).",
  MARK_ORDER_COMPLETED_SUCCESS: "Order successfully marked as completed.",
  MARK_ORDER_CANCELLED_SUCCESS: "Order successfully marked as cancelled.",
  PERSIST_CSV_FILE_CONTENT_TO_UPDATE_ORDERS_SUCCESS: "Successfully persisted the CSV file content to update the orders.",

  // ? PRODUCT SLICE
  CLIENT_CREATE_PRODUCT_SUCCESS: "Product successfully created. An admin will review your request to make it a wishable product for all users!",

  // ? PRICES SLICE
  UPDATE_PRICE_SUCCESS: "Price successfully updated.",
  DELETE_PRICE_SUCCESS: "Price successfully deleted.",
};
