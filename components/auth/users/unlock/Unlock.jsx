"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { unlockAccount } from "@/lib/redux/slices/authSlice";
import ButtonMui from "@/components/forms/ButtonMui";

import Image from "next/image";
import classes from "../confirmation/Confirmation.module.scss";

const Unlock = ({ lng }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const unlockToken = searchParams.get("unlock_token");
  const dispatch = useDispatch();
  const { notification } = useSelector(state => state.rootReducer.auth);

  // * This is responsible for sending the unlock account request to the backend when the user lands on this page
  useEffect(() => {
    if (unlockToken) {
      dispatch(unlockAccount(unlockToken));
    }
  }, []);

  const redirectToLoginHandler = () => {
    router.replace(`/${lng}/login`);
  };

  return (
    <>
      {notification && notification.flash_code === "UNLOCK_ACCOUNT_SUCCESS" && (
        <div className={classes["confirmation-message-container"]}>
          <Image
            src="/SVGS/success.svg"
            alt="Success ribon"
            width={300}
            height={300}
          />

          <h1>Account unlocked!</h1>
          <h2>You can now try to login again.</h2>

          <p>
            If you struggle with your password, you should consider changing it
            as you could get your account locked again without being able to
            unlock it until you wait for it to be unlocked by the system
            automatically. In this case you'll have to wait or contact your fund
            manager.
          </p>

          <ButtonMui
            width="100%"
            height="5rem"
            marginTop="5rem"
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

      {notification && notification.flash_code === "UNLOCK_ACCOUNT_ERROR" && (
        <div className={classes["confirmation-message-container"]}>
          <Image
            src="/SVGS/failure.svg"
            alt="UFO with a laser in which is written 404 for error 404"
            width={300}
            height={300}
          />
          <h1>Unlock action Failed</h1>
          <h2>Something went wrong...</h2>
          <p style={{ textAlign: "center" }}>
            Please try again later or contact the support for assistance.
          </p>
        </div>
      )}
    </>
  );
};

export default Unlock;
