"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { updateUserDetails } from "@/lib/redux/slices/userDetailSlice";
import { motion } from "framer-motion";

import InputMui from "@/components/forms/InputMui";
import SelectMui from "@/components/forms/SelectMui";
import ButtonMui from "@/components/forms/ButtonMui";

// ? Below is for checkbox (Create a component for it?)
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import countryOptions from "@/lib/countries";
import classes from "./UserDetailsForm.module.scss";


const UserDetailsForm = ({ lng, userDetails, passportFileInfo }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isBillingAddressSameAsAddress, setIsBillingAddressSameAsAddress] =
    useState(true);
  const billingAddressCheckboxChangeHandler = e => {
    setIsBillingAddressSameAsAddress(prevState => e.target.checked);
    if (e.target.checked) {
      formik.values.billingAddressLineOne = ""
      formik.values.billingAddressLineTwo = ""
      formik.values.billingAddressLineThree = ""
      formik.values.billingPostcode = ""
      formik.values.billingCity = ""
      formik.values.billingCountry = ""
    }
  };

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

    // * The label (billing address same as address)
    "& .MuiTypography-root": {
      fontSize: "2rem !important",
    },
  };

  const formik = useFormik({
    initialValues: {
      // ! Personal info, non optional
      // email: userDetails.email,
      title: userDetails.title,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      middleNames: userDetails.middleNames || "",
      phoneNumber: userDetails.phoneNumber,

      addressLineOne: userDetails.addressLineOne || "",
      addressLineTwo: userDetails.addressLineTwo || "",
      addressLineThree: userDetails.addressLineThree || "",
      addressPostcode: userDetails.addressPostcode || "",
      addressCity: userDetails.addressCity || "",
      addressCountry: userDetails.addressCountry || "",

      billingAddressLineOne: userDetails.billingAddressLineOne || "",
      billingAddressLineTwo: userDetails.billingAddressLineTwo || "",
      billingAddressLineThree: userDetails.billingAddressLineThree || "",
      billingPostcode: userDetails.billingPostcode || "",
      billingCity: userDetails.billingCity || "",
      billingCountry: userDetails.billingCountry || "",
    },
    validate: values => validate(values, isBillingAddressSameAsAddress),
    onSubmit: values => {
      // setIsSubmitting(true);

      const userDetailsFormData = { ...values };

      dispatch(updateUserDetails(userDetailsFormData));
      router.push(`/${lng}/products`);
    },
  });

  const countries = [
    { value: "", label: "Select a country" },
    { value: "", label: "----------------" },
    { value: "SG", label: "Singapore" },
    { value: "CN", label: "China" },
    { value: "HK", label: "Hong Kong" },
    { value: "TW", label: "Taiwan" },
    { value: "GB", label: "United Kingdom of Great Britain and Northern Ireland (the)" },
    { value: "US", label: "United States of America (the)" },
    { value: "", label: "----------------" },
    ...countryOptions,
  ];

  return (
    <motion.form
      className={classes["user-details-form"]}
      onSubmit={formik.handleSubmit}
      key="user-detail-form"
      data-testid="login-formik-form"
      transition={{ duration: 0.25 }}
      initial={{ opacity: 0, height: "auto" }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: "auto" }}
    >
      <h2>PERSONAL DETAILS</h2>
      <InputMui
        required={true}
        id="outlined-disabled email"
        name="email"
        type="email"
        label="Email"
        disabled={true}
        defaultValue={userDetails.email}
      />

      <SelectMui
        required={true}
        id="outlined-title-input title"
        name="title"
        inputLabel="Title"
        helperText={null}
        labelId="title-label"
        value={formik.values.title}
        disabled={true}
        menuItems={[
          { value: "Mr", label: "Mr" },
          { value: "Mrs", label: "Mrs" },
          { value: "Ms", label: "Ms" },
          { value: "Miss", label: "Miss" },
          { value: "Dr", label: "Dr" },
          { value: "Prof", label: "Prof" },
        ]}
      />

      <InputMui
        required={true}
        id="outlined-disabled firstName"
        name="firstName"
        type="text"
        label="First Name"
        disabled={true}
        defaultValue={formik.values.firstName}
      />

      <InputMui
        required={true}
        id="outlined-disabled lastName"
        name="lastName"
        type="text"
        label="Last name"
        disabled={true}
        defaultValue={formik.values.lastName}
      />

      <InputMui
        required={false}
        id="outlined-disabled middleNames"
        name="middleNames"
        type="text"
        label="Middle names"
        helperText={formik.errors.middleNames && formik.errors.middleNames}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.middleNames && !!formik.errors.middleNames}
        valid={!!formik.touched.middleNames && !formik.errors.middleNames}
        disabled={false}
        defaultValue={formik.values.middleNames}
      />

      <InputMui
        required={true}
        id="outlined-disabled phoneNumber"
        name="phoneNumber"
        type="text"
        label="Mobile number (country code + number)"
        helperText={formik.errors.phoneNumber && formik.errors.phoneNumber}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.phoneNumber && !!formik.errors.phoneNumber}
        valid={!!formik.touched.phoneNumber && !formik.errors.phoneNumber}
        disabled={false}
        defaultValue={formik.values.phoneNumber}
      />

      <h2>MAILING ADDRESS</h2>
      <InputMui
        required={true}
        id="outlined-disabled addressLineOne"
        name="addressLineOne"
        type="text"
        label="Address line one"
        helperText={
          formik.errors.addressLineOne && formik.errors.addressLineOne
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.addressLineOne && !!formik.errors.addressLineOne
        }
        valid={!!formik.touched.addressLineOne && !formik.errors.addressLineOne}
        disabled={false}
        defaultValue={formik.values.addressLineOne}
      />

      <InputMui
        required={false}
        id="outlined-disabled addressLineTwo"
        name="addressLineTwo"
        type="text"
        label="Address line two"
        helperText={
          formik.errors.addressLineTwo && formik.errors.addressLineTwo
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.addressLineTwo && !!formik.errors.addressLineTwo
        }
        valid={!!formik.touched.addressLineTwo && !formik.errors.addressLineTwo}
        disabled={false}
        defaultValue={formik.values.addressLineTwo}
      />

      <InputMui
        required={false}
        id="outlined-disabled addressLineThree"
        name="addressLineThree"
        type="text"
        label="Address line three"
        helperText={
          formik.errors.addressLineThree && formik.errors.addressLineThree
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.addressLineThree && !!formik.errors.addressLineThree
        }
        valid={
          !!formik.touched.addressLineThree && !formik.errors.addressLineThree
        }
        disabled={false}
        defaultValue={formik.values.addressLineThree}
      />

      <InputMui
        required={true}
        id="outlined-disabled addressPostcode"
        name="addressPostcode"
        type="text"
        label="Address postocode"
        helperText={
          formik.errors.addressPostcode && formik.errors.addressPostcode
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.addressPostcode && !!formik.errors.addressPostcode
        }
        valid={
          !!formik.touched.addressPostcode && !formik.errors.addressPostcode
        }
        disabled={false}
        defaultValue={formik.values.addressPostcode}
      />

      <InputMui
        required={true}
        id="outlined-disabled addressCity"
        name="addressCity"
        type="text"
        label="Address city"
        helperText={formik.errors.addressCity && formik.errors.addressCity}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.addressCity && !!formik.errors.addressCity}
        valid={!!formik.touched.addressCity && !formik.errors.addressCity}
        disabled={false}
        defaultValue={formik.values.addressCity}
      />

      <SelectMui
        required={true}
        id="outlined-title-input addressCountry"
        name="addressCountry"
        inputLabel="Address country"
        helperText={
          formik.errors.addressCountry && formik.errors.addressCountry
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.errors.addressCountry}
        valid={!!formik.touched.addressCountry && !formik.errors.addressCountry}
        labelId="addressCountry-label"
        value={formik.values.addressCountry}
        disabled={false}
        menuItems={countries}
      />

      {/* // ! BILLING ADDRESS */}
      <h2>BILLING ADDRESS</h2>
      <FormControlLabel
        sx={formControlLabelStyle}
        control={
          <Checkbox
            defaultChecked
            sx={syledCheckBox}
            onChange={billingAddressCheckboxChangeHandler}
          />
        }
        label="Address and billing address are the same"
      />

      {!isBillingAddressSameAsAddress &&
        <motion.div
          className={classes["billing-address-section"]}
          transition={{ duration: 0.5, delay: 0.25 }}
          initial={{ opacity: 0, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: "auto" }}
        >
          <InputMui
            required={true}
            id="outlined-disabled billingAddressLineOne"
            name="billingAddressLineOne"
            type="text"
            label="Billing address line one"
            helperText={
              formik.errors.billingAddressLineOne && formik.errors.billingAddressLineOne
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.billingAddressLineOne && !!formik.errors.billingAddressLineOne
            }
            valid={!!formik.touched.billingAddressLineOne && !formik.errors.billingAddressLineOne}
            disabled={false}
            defaultValue={formik.values.billingAddressLineOne}
          />

          <InputMui
            required={false}
            id="outlined-disabled billingAddressLineTwo"
            name="billingAddressLineTwo"
            type="text"
            label="Billing address line two"
            helperText={
              formik.errors.billingAddressLineTwo && formik.errors.billingAddressLineTwo
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.billingAddressLineTwo && !!formik.errors.billingAddressLineTwo
            }
            valid={!!formik.touched.billingAddressLineTwo && !formik.errors.billingAddressLineTwo}
            disabled={false}
            defaultValue={formik.values.billingAddressLineTwo}
          />

          <InputMui
            required={false}
            id="outlined-disabled billingAddressLineThree"
            name="billingAddressLineThree"
            type="text"
            label="Billing address line three"
            helperText={
              formik.errors.billingAddressLineThree && formik.errors.billingAddressLineThree
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.billingAddressLineThree && !!formik.errors.billingAddressLineThree
            }
            valid={
              !!formik.touched.billingAddressLineThree && !formik.errors.billingAddressLineThree
            }
            disabled={false}
            defaultValue={formik.values.billingAddressLineThree}
          />

          <InputMui
            required={true}
            id="outlined-disabled billingPostcode"
            name="billingPostcode"
            type="text"
            label="Billing postocode"
            helperText={
              formik.errors.billingPostcode && formik.errors.billingPostcode
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.billingPostcode && !!formik.errors.billingPostcode
            }
            valid={
              !!formik.touched.billingPostcode && !formik.errors.billingPostcode
            }
            disabled={false}
            defaultValue={formik.values.billingPostcode}
          />

          <InputMui
            required={true}
            id="outlined-disabled billingCity"
            name="billingCity"
            type="text"
            label="Billing city"
            helperText={formik.errors.billingCity && formik.errors.billingCity}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.billingCity && !!formik.errors.billingCity}
            valid={!!formik.touched.billingCity && !formik.errors.billingCity}
            disabled={false}
            defaultValue={formik.values.billingCity}
          />

          <SelectMui
            required={true}
            id="outlined-title-input billingCountry"
            name="billingCountry"
            inputLabel="Billing country"
            helperText={
              formik.errors.billingCountry && formik.errors.billingCountry
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.errors.billingCountry}
            valid={!!formik.touched.billingCountry && !formik.errors.billingCountry}
            labelId="billingCountry-label"
            value={formik.values.billingCountry}
            disabled={false}
            menuItems={countries}
          />
        </motion.div>
      }

      {/* // ! SUBMIT BUTTON */}
      <ButtonMui
        width="100%"
        height="5rem"
        marginTop="5rem"
        fontSize="2rem"
        backgroundColor="#7b00ff"
        color="white"
        type="submit"
        text="Save my details"
        disabled={false}
        onClickHandler={() => {}}
      />
    </motion.form>
  );
};

// ! VALIDATION FOR THE FORMIK FORM
const validate = (values, isBillingAddressSameAsAddress) => {
  const errors = {};

  // ! PERSONAL SECTION
  if (values.middleNames) {
    if (values.middleNames.trim().length < 1) {
      errors.middleNames = "Spaces are not valid characters";
    } else if (/\*/g.test(values.middleNames)) {
      errors.middleNames = "Forbidden special character detected, retry with valid middle names";
    }
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = "Make sure you enter your phone number";
  }

  // ! ADDRESS SECTION
  if (!values.addressLineOne) {
    errors.addressLineOne =
      "You need to provide the first line of your address";
  } else if (/\*/g.test(values.addressLineOne)) {
    errors.addressLineOne =
      "Forbidden special character detected, retry without special characters";
  } else if (values.addressLineOne.trim().length < 2) {
    errors.addressLineOne = "Invalid address: Too short";
  }

  if (values.addressLineTwo) {
    if (/\*/g.test(values.addressLineTwo)) {
      errors.addressLineTwo =
        "Forbidden special character detected, retry without special characters";
    } else if (values.addressLineTwo.trim().length < 2) {
      errors.addressLineTwo = "Invalid address: Too short";
    }
  }

  if (values.addressLineThree) {
    if (/\*/g.test(values.addressLineThree)) {
      errors.addressLineThree =
        "Forbidden special character detected, retry without special characters";
    } else if (values.addressLineThree.trim().length < 2) {
      errors.addressLineThree = "Invalid address: Too short";
    }
  }

  if (!values.addressPostcode) {
    errors.addressPostcode = "You need to provide the postcode of your address";
  } else if (/\*/g.test(values.addressPostcode)) {
    errors.addressPostcode =
      "Forbidden special character detected, retry without special characters";
  } else if (values.addressPostcode.trim().length < 1) {
    errors.addressPostcode = "Spaces are not valid characters";
  }

  if (!values.addressCity) {
    errors.addressCity = "You need to provide the city of your address";
  } else if (/\*/g.test(values.addressCity)) {
    errors.addressCity =
      "Forbidden special character detected, retry without special characters";
  }

  if (!values.addressCountry) {
    errors.addressCountry = "You need to provide the country of your address";
  }

  // ! BILLING ADDRESS SECTION
  if (!isBillingAddressSameAsAddress) {
    if (!values.billingAddressLineOne) {
      errors.billingAddressLineOne =
        "You need to provide the first line of your address";
    } else if (/\*/g.test(values.billingAddressLineOne)) {
      errors.billingAddressLineOne =
        "Forbidden special character detected, retry without special characters";
    } else if (values.billingAddressLineOne.trim().length < 2) {
      errors.billingAddressLineOne = "Invalid address: Too short";
    }

    if (values.billingAddressLineTwo) {
      if (/\*/g.test(values.billingAddressLineTwo)) {
        errors.billingAddressLineTwo =
          "Forbidden special character detected, retry without special characters";
      } else if (values.billingAddressLineTwo.trim().length < 2) {
        errors.billingAddressLineTwo = "Invalid address: Too short";
      }
    }

    if (values.billingAddressLineThree) {
      if (/\*/g.test(values.billingAddressLineThree)) {
        errors.billingAddressLineThree =
          "Forbidden special character detected, retry without special characters";
      } else if (values.billingAddressLineThree.trim().length < 2) {
        errors.billingAddressLineThree = "Invalid address: Too short";
      }
    }

    if (!values.billingPostcode) {
      errors.billingPostcode = "You need to provide the postcode of your address";
    } else if (/\*/g.test(values.billingPostcode)) {
      errors.billingPostcode =
        "Forbidden special character detected, retry without special characters";
    } else if (values.billingPostcode.trim().length < 1) {
      errors.billingPostcode = "Spaces are not valid characters";
    }

    if (!values.billingCity) {
      errors.billingCity = "You need to provide the city of your address";
    } else if (/\*/g.test(values.billingCity)) {
      errors.billingCity =
        "Forbidden special character detected, retry without special characters";
    }

    if (!values.billingCountry) {
      errors.billingCountry = "You need to provide the country of your address";
    }
  }

  // console.log(errors);

  return errors;
};

export default UserDetailsForm
