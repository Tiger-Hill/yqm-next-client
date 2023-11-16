"use client";

import Cookies from "js-cookie";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "@/lib/redux/slices/userDetailSlice";
import { useRouter } from "next/navigation";
import UserDetailsForm from "./UserDetailsForm";
import ButtonMui from "../forms/ButtonMui";

import Image from "next/image";
import classes from "./Account.module.scss";

const Account = ({ lng }) => {
  const dispatch = useDispatch();
  const { userDetails, passportFileInfo } = useSelector(
    state => state.rootReducer.userDetail
  );
  // const  = useSelector(state => state.rootReducer.userDetail.passportFileInfo);
  const router = useRouter();

  useEffect(() => {
    !userDetails && dispatch(getUserDetails());
  }, [userDetails]);

  const changePasswordHandler = () => {
    router.push(`/${lng}/change-password`);
  };

  // console.log(passportFileInfo);
  // console.log(
  //   `${process.env.NEXT_PUBLIC_API_URL}${passportFileInfo?.originalFile}`
  // );

  return (
    <div className={classes["account-container"]}>
      <header>
        <Image
          src="/IMGS/user-details.jpg"
          alt="A mix of the 2 principal colors of the website: Purple and orange"
          width={4000}
          height={4000}
        />

        <h1>Account</h1>
      </header>

      <section className={classes["account-section"]}>
        <ButtonMui
          width="100%"
          maxWidth="800px"
          // height="5rem"
          // marginTop="2rem"
          fontSize="2rem"
          backgroundColor="#7b00ff"
          color="white"
          // disabledBakcgroundColor="#DCDCDC"
          // disabledColor="white"
          type="button"
          // disabled={formik.errors.email || formik.errors.password}
          text="Change my password"
          onClickHandler={changePasswordHandler}
        />

        {userDetails && (
          <UserDetailsForm
            lng={lng}
            userDetails={userDetails}
            passportFileInfo={passportFileInfo}
          />
        )}
      </section>
    </div>
  );
};

export default Account;
