"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { confirmAccount } from "@/lib/redux/slices/passwordSlice";
import Image from "next/image";
import ButtonMui from "@/components/forms/ButtonMui";

import classes from "./Confirmation.module.scss";

const Confirmation = ({ lng }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const confirmationToken = searchParams.get("confirmation_token");
  const dispatch = useDispatch();
  const { notification } = useSelector(state => state.rootReducer.password);

  // * This is responsible for sending the account confirmation request to the backend when the user lands on this page
  useEffect(() => {
    if (!confirmationToken) return;

    dispatch(confirmAccount(confirmationToken));
  }, [confirmationToken]);

  const redirectToLoginHandler = () => {
    router.replace(`/${lng}/login`)
  };

  return (
    <>
      {notification &&
        notification.flash_code === "CONFIRM_ACCOUNT_SUCCESS" && (
          <div className={classes["confirmation-message-container"]}>
            <Image
              src="/SVGS/success.svg"
              alt="Success ribon"
              width={300}
              height={300}
            />

            <h1>Comfirmation Success!</h1>
            <h2>You can now login.</h2>

            <ButtonMui
              width="100%"
              height="5rem"
              // marginTop="2rem"
              fontSize="3rem"
              backgroundColor="#f8ae01"
              color="white"
              // disabledBakcgroundColor="#DCDCDC"
              // disabledColor="white"
              type="button"
              // disabled={formik.errors.email || formik.errors.password}
              text="Login"
              onClickHandler={redirectToLoginHandler}
            />
          </div>
        )}

      {notification && notification.flash_code === "CONFIRM_ACCOUNT_ERROR" && (
        <div className={classes["confirmation-message-container"]}>
          <Image
            src="/SVGS/failure.svg"
            alt="UFO with a laser in which is written 404 for error 404"
            width={300}
            height={300}
          />

          <h1>Comfirmation Failed</h1>
          <h2>Something went wrong...</h2>
          <p style={{ textAlign: "center" }}>
            Please try again later or contact the support for assistance.
          </p>
        </div>
      )}
    </>
  );
};

export default Confirmation;
