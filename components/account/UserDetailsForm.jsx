"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { updateUserDetails } from "@/lib/redux/slices/userDetailSlice";
import { AnimatePresence, motion } from "framer-motion";

import InputMui from "@/components/forms/InputMui";
import SelectMui from "@/components/forms/SelectMui";
import ButtonMui from "@/components/forms/ButtonMui";
import DatePickerMui from "@/components/forms/DatePickerMui";

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
      // birthDate: userDetails.birthDate || "",
      phoneNumber: userDetails.phoneNumber,
      // occupation: userDetails.occupation || "",
      // sourceOfWealth: userDetails.sourceOfWealth || "",

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

      // bankName: userDetails.bankName || "",
      // bankAddress: userDetails.bankAddress || "",
      // bankIdentifierCodeType: userDetails.bankIdentifierCodeType || "",
      // bankIdentifierCode: userDetails.bankIdentifierCode || "",

      // bankAccountNumber: userDetails.bankAccountNumber || "",
      // bankIban: userDetails.bankIban || "",
    },
    validate: values => validate(values, isBillingAddressSameAsAddress),
    onSubmit: values => {
      // setIsSubmitting(true);

      // if (!existingPassportFile && !passportFileToUpload) {
      //   setErrorPassportFile("No file attached");
      //   return;
      // }

      const userDetailsFormData = {
        ...values,
        // passport: passportFileToUpload,
      };

      console.log(userDetailsFormData);

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

  // // ! PASSPORT FILE SETUP
  // const [existingPassportFile, setExistingPassportFile] =
  //   useState(passportFileInfo);
  // const [passportFileToUpload, setPassportFileToUpload] = useState(null);
  // const [passportFileBlobUrl, setPassportFileBlobUrl] = useState(null);
  // const [errorPassportFile, setErrorPassportFile] = useState(null);

  // // ! PASSPORT FILE HANDLER
  // const changePassportFileHandler = e => {
  //   if (e.target.files.length > 0) {
  //     if (e.target.files[0].size > 10485760) {
  //       // ! THE SIZE FILED IS IN BYTES (size ÷ 1024 ÷ 2014 TO GET MB SIZE)
  //       // ! 10485760 bytes = 10MB
  //       // ? https://www.gbmb.org/bytes-to-mb
  //       setErrorPassportFile("The file size is too big (max 10MB)");
  //       setPassportFileToUpload(null);
  //     } else if (
  //       !/(jpg)$|(jpeg)$|(png)$|(pdf)$/g.test(e.target.files[0].type)
  //     ) {
  //       setErrorPassportFile(
  //         "Invalid format. allowed format are .JPG, .JPEG, .PNG and .PDF"
  //       );
  //       setPassportFileToUpload(null);
  //     } else {
  //       setErrorPassportFile(null);
  //       setPassportFileToUpload(e.target.files[0]);
  //     }
  //   } else {
  //     setPassportFileToUpload(null);
  //     setErrorPassportFile("No file attached");
  //   }
  // };

  // // ! CREATE LINKS FOR THE FILES. WE USE THE LINK TO RENDER THE ATTACHED DOCUMENT FOR THE USER (UX)
  // useEffect(() => {
  //   //  * PASSPORT URL SETUP
  //   passportFileToUpload ? setPassportFileBlobUrl(URL.createObjectURL(passportFileToUpload)) : setPassportFileBlobUrl(null);

  // }, [passportFileToUpload]);

  // // ! FILE ERROR HANDLER
  // const fileErrorHandler = e => {
  //   // if (/signature/g.test(e.target.alt)) {
  //   //   setErrorSignatureFile(`"${signatureFileToUpload.name}": This file is corrupted, please select another file.`);
  //   //   setSignatureFileToUpload(null)
  //   //   setSignatureFileBlobUrl(null)
  //   // } else

  //   if (/passport/g.test(e.target.alt)) {
  //     setErrorPassportFile(
  //       `"${passportFileToUpload.name}": This file is corrupted, please select another file.`
  //     );
  //     setPassportFileToUpload(null);
  //     setPassportFileBlobUrl(null);
  //   }
  //   // else if (/proof of address/g.test(e.target.alt)) {
  //   //   setErrorPOAFile(`"${poaFileToUpload.name}": This file is corrupted, please select another file.`);
  //   //   setPoaFileToUpload(null)
  //   //   setPoaFileBlobUrl(null)
  //   // }
  // };

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
        // helperText={formik.errors.email ? formik.errors.email : "Enter your email address"}
        // onChangeHandler={formik.handleChange}
        // onBlurHandler={formik.handleBlur}
        // error={!!formik.touched.email && !!formik.errors.email}
        // valid={!!formik.touched.email && !formik.errors.email}
        disabled={true}
        defaultValue={userDetails.email}
      />

      <SelectMui
        required={true}
        id="outlined-title-input title"
        name="title"
        inputLabel="Title"
        helperText={null}
        // label="Required"
        // onChangeHandler={formik.handleChange}
        // onBlurHandler={formik.handleBlur}
        // error={!!formik.touched.title && !!formik.errors.title}
        // valid={!!formik.touched.title && !formik.errors.title}
        labelId="title-label"
        value={formik.values.title}
        // emptyValue={false}
        // emptyValueText={null}
        disabled={true}
        menuItems={[
          { value: "Mr", label: "Mr" },
          { value: "Mrs", label: "Mrs" },
          { value: "Ms", label: "Ms" },
          { value: "Miss", label: "Miss" },
          { value: "Dr", label: "Dr" },
          { value: "Prof", label: "Prof" },
        ]}

        // defaultValue={formik.values.addressCountry}
      />

      <InputMui
        required={true}
        id="outlined-disabled firstName"
        name="firstName"
        type="text"
        label="First Name"
        // helperText={formik.errors.email ? formik.errors.email : "Enter your email address"}
        // onChangeHandler={formik.handleChange}
        // onBlurHandler={formik.handleBlur}
        // error={!!formik.touched.email && !!formik.errors.email}
        // valid={!!formik.touched.email && !formik.errors.email}
        disabled={true}
        defaultValue={formik.values.firstName}
      />

      <InputMui
        required={true}
        id="outlined-disabled lastName"
        name="lastName"
        type="text"
        label="Last name"
        // helperText={formik.errors.email ? formik.errors.email : "Enter your email address"}
        // onChangeHandler={formik.handleChange}
        // onBlurHandler={formik.handleBlur}
        // error={!!formik.touched.email && !!formik.errors.email}
        // valid={!!formik.touched.email && !formik.errors.email}
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

      {/* <DatePickerMui
        inputName="birthDate" // For DatePicker component
        require={true}
        id="outlined-disabled birthDate"
        label={"Date of birth*"}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        value={formik.values.birthDate}
        defaultValue={formik.values.birthDate}
        // type="date"
        formik={formik}
        disableFuture={true}
        helperText={formik.errors.birthDate && formik.errors.birthDate}
      /> */}

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

      {/* <InputMui
        required={true}
        id="outlined-disabled occupation"
        name="occupation"
        type="text"
        label="Occupation"
        helperText={formik.errors.occupation && formik.errors.occupation}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.occupation && !!formik.errors.occupation}
        valid={!!formik.touched.occupation && !formik.errors.occupation}
        disabled={false}
        defaultValue={formik.values.occupation}
      />

      <InputMui
        required={true}
        id="outlined-disabled sourceOfWealth"
        name="sourceOfWealth"
        type="text"
        label="Source of wealth"
        helperText={
          formik.errors.sourceOfWealth && formik.errors.sourceOfWealth
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.sourceOfWealth && !!formik.errors.sourceOfWealth
        }
        valid={!!formik.touched.sourceOfWealth && !formik.errors.sourceOfWealth}
        disabled={false}
        defaultValue={formik.values.sourceOfWealth}
      /> */}

      <h2>ADDRESS DETAILS</h2>
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
        // label="Required"
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.errors.addressCountry}
        valid={!!formik.touched.addressCountry && !formik.errors.addressCountry}
        labelId="addressCountry-label"
        value={formik.values.addressCountry}
        // emptyValue={false}
        // emptyValueText={null}
        disabled={false}
        menuItems={countries}

        // defaultValue={formik.touched.title}
      />

      {/* // ! BILLING ADDRESS */}
      <h2>BILLING DETAILS</h2>
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
            // label="Required"
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.errors.billingCountry}
            valid={!!formik.touched.billingCountry && !formik.errors.billingCountry}
            labelId="billingCountry-label"
            value={formik.values.billingCountry}
            // emptyValue={false}
            // emptyValueText={null}
            disabled={false}
            menuItems={countries}

            // defaultValue={formik.touched.title}
          />
        </motion.div>
      }

      {/* <h2>BANK DETAILS</h2>
      <InputMui
        required={true}
        id="outlined-disabled bankName"
        name="bankName"
        type="text"
        label="Bank name"
        helperText={formik.errors.bankName && formik.errors.bankName}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.bankName && !!formik.errors.bankName}
        // valid={!!formik.touched.bankName && !formik.errors.bankName}
        disabled={false}
        defaultValue={formik.values.bankName}
      />

      <InputMui
        required={true}
        id="outlined-disabled bankAddress"
        name="bankAddress"
        type="text"
        label="Bank address"
        helperText={formik.errors.bankAddress && formik.errors.bankAddress}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.bankAddress && !!formik.errors.bankAddress}
        valid={!!formik.touched.bankAddress && !formik.errors.bankAddress}
        disabled={false}
        defaultValue={formik.values.bankAddress}
      />

      <InputMui
        required={false}
        id="outlined-disabled bankIdentifierCode"
        name="bankIdentifierCode"
        type="text"
        label="Bank identifier code"
        helperText={
          formik.errors.bankIdentifierCode && formik.errors.bankIdentifierCode
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.bankIdentifierCode &&
          !!formik.errors.bankIdentifierCode
        }
        valid={
          !!formik.touched.bankIdentifierCode &&
          !formik.errors.bankIdentifierCode
        }
        disabled={false}
        defaultValue={formik.values.bankIdentifierCode}
      />

      <InputMui
        required={false}
        id="outlined-disabled bankAccountNumber"
        name="bankAccountNumber"
        type="text"
        label="Bank account number"
        helperText={
          formik.errors.bankAccountNumber && formik.errors.bankAccountNumber
        }
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={
          !!formik.touched.bankAccountNumber &&
          !!formik.errors.bankAccountNumber
        }
        valid={
          !!formik.touched.bankAccountNumber && !formik.errors.bankAccountNumber
        }
        disabled={false}
        defaultValue={formik.values.bankAccountNumber}
      />

      <InputMui
        required={false}
        id="outlined-disabled bankIban"
        name="bankIban"
        type="text"
        label="Bank IBAN"
        helperText={formik.errors.bankIban && formik.errors.bankIban}
        onChangeHandler={formik.handleChange}
        onBlurHandler={formik.handleBlur}
        error={!!formik.touched.bankIban && !!formik.errors.bankIban}
        valid={!!formik.touched.bankIban && !formik.errors.bankIban}
        disabled={false}
        defaultValue={formik.values.bankIban}
      /> */}

      {/* <h2>Documents</h2>
      <ButtonMui
        width="fit-content"
        height="5rem"
        marginTop="2rem"
        fontSize="1.7rem"
        backgroundColor="#7b00ff"
        color="white"
        disabledBakcgroundColor="#DCDCDC"
        disabledColor="white"
        type="button"
        disabled={false}
        text="Upload passport (.JPG, .JPEG, .PNG and .PDF)"
        onClickHandler={() => {}}
        onChangeHandler={changePassportFileHandler}
        isFileButton={true}
      /> */}

      {/* // ! PASSPORT FILE NAME */}
      {/* // ? IF THERE'S AN EXISTING FILE AND NO FILE TO UPLOAD  */}
      {/* {existingPassportFile && !passportFileToUpload && (
        <p className="file-message-success">{existingPassportFile.fileName}</p>
      )} */}

      {/* // ? IF THERE'S A NEW FILE TO UPLOAD (DOESN'T MATTER IF THERE'S AN EXISTING FILE OR NOT)  */}
      {/* {passportFileToUpload && (
        <p className="file-message-success">{passportFileToUpload.name}</p>
      )} */}

      {/* {errorPassportFile && (
        <p className="file-message-error">{errorPassportFile}</p>
      )} */}

      {/* // ! PASSPORT PDF RENDERING */}
      {/* // * EXISTING FILE */}
      {/* {existingPassportFile &&
        !passportFileToUpload &&
        /pdf$/g.test(existingPassportFile.fileExtension) === true &&
        !errorPassportFile && (
          <iframe
            src={`${process.env.NEXT_PUBLIC_API_URL}${existingPassportFile.originalFile}`}
            alt="existing passport pdf"
          ></iframe>
        )} */}

      {/* // * RENDERING NEW FILE */}
      {/* {passportFileToUpload &&
        /\/pdf$/g.test(passportFileToUpload.type) === true &&
        !errorPassportFile && (
          <iframe
            src={passportFileBlobUrl}
            alt="new passport pdf"
            // data-testid="user-details-passport-document-iframe"
          ></iframe>
        )} */}

      {/* // ! PASSPORT IMG RENDERING */}
      {/* // * EXISTING FILE */}
      {/* {existingPassportFile &&
        !passportFileToUpload &&
        /pdf$/g.test(existingPassportFile.fileExtension) === false &&
        !errorPassportFile && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${existingPassportFile.originalFile}`}
            alt="existing user's passport image"
            // onError={fileErrorHandler}
          />
        )} */}

      {/* // * RENDERING NEW FILE */}
      {/* {passportFileToUpload &&
        /\/pdf$/g.test(passportFileToUpload.type) === false &&
        !errorPassportFile && (
          <img
            src={passportFileBlobUrl}
            alt="new user's passport image"
            onError={fileErrorHandler}
          />
        )} */}

      {/* // ! SUBMIT BUTTON */}
      <ButtonMui
        width="100%"
        height="5rem"
        marginTop="5rem"
        fontSize="2rem"
        backgroundColor="#7b00ff"
        color="white"
        // disabledBakcgroundColor="#DCDCDC"
        // disabledColor="white"
        type="submit"
        // disabled={formik.errors.email || formik.errors.password}
        text="Save my details"
        onClickHandler={() => {}}
        // onChangeHandler={() => {}}
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

  // if (values.occupation) {
  //   if (values.occupation.trim().length < 1) {
  //     errors.occupation = "Spaces are not valid characters";
  //   } else if (/\*/g.test(values.occupation)) {
  //     errors.occupation = "Forbidden special character detected, retry with valid middle names";
  //   }
  // }

  // if (values.sourceOfWealth) {
  //   if (values.sourceOfWealth.trim().length < 1) {
  //     errors.sourceOfWealth = "Spaces are not valid characters";
  //   } else if (/\*/g.test(values.sourceOfWealth)) {
  //     errors.sourceOfWealth = "Forbidden special character detected, retry with valid middle names";
  //   }
  // }

  // if (!values.birthDate) {
  //   errors.birthDate = "Please provide your birth date";
  // } else if (values.birthDate.split("-")[0] < 1902) {
  //   errors.birthDate = "Are you sure?";
  // } else if (
  //   values.birthDate.split("-")[0] > new Date().toISOString().slice(0, 4)
  // ) {
  //   errors.birthDate = "Time travellers are not allowed to invest with us";
  // }

  if (!values.phoneNumber) {
    errors.phoneNumber = "Make sure you enter your phone number";
  }
  // else if (
  //   /((\+[0-9])|(\(\+44)\))[\/s 0-9 -]*$/.test(values.phoneNumber) === false
  // ) {
  //   errors.phoneNumber = "This format is invalid";
  // }

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

  // ! BANK SECTION
  // if (!values.bankName) {
  //   errors.bankName = "Please provide a bank name";
  // } else if (values.bankName.trim().length < 1) {
  //   errors.bankName = "Spaces are not valid characters";
  // } else if (/\*/g.test(values.bankName)) {
  //   errors.bankName =
  //     "Forbidden special character detected, retry with a valid bank name";
  // }

  // if (!values.bankAddress) {
  //   errors.bankAddress = "Please provide a bank address";
  // } else if (values.bankAddress.trim().length < 2) {
  //   errors.bankAddress = "This bank address is too short";
  // } else if (/\*/g.test(values.bankAddress)) {
  //   errors.bankAddress =
  //     "Forbidden special character detected, retry with a valid bank address";
  // }

  // if (
  //   values.bankIban ||
  //   values.bankIdentifierCode ||
  //   values.bankAccountNumber
  // ) {
  //   if (!values.bankIdentifierCode && !values.bankAccountNumber) {
  //     // * Norway has the shortest IBAN with 15 characters. Malta has the longest IBAN with 31 characters.
  //     if (/\*/g.test(values.bankIban)) {
  //       errors.bankIban =
  //         "Forbidden special character detected, retry with a valid IBAN";
  //     } else if (values.bankIban.trim().length < 15) {
  //       errors.bankIban = "Invalid IBAN: Too short (minimum 15 characters)";
  //     } else if (values.bankIban.trim().length > 31) {
  //       errors.bankIban = "Invalid IBAN: Too long (maximum 31 characters)";
  //     }
  //   }
  // }

  // if (
  //   values.bankIban ||
  //   values.bankIdentifierCode ||
  //   values.bankAccountNumber
  // ) {
  //   // * ISO 9362:2009 (dated 2009-10-01): 4 letters / 2 letters / 2 letters OR digit / 3 letters or digit (optional)
  //   if (!values.bankIban) {
  //     // ! VALIDATING 2 INPUTS AT THE SAME TIME BELOW
  //     if (!/^[A-Z]{4} ?[A-Z]{2} ?[A-Z0-9]{2} ?([A-Z0-9]{3})?$/g.test(values.bankIdentifierCode.trim())) {
  //       errors.bankIdentifierCode = "Invalid bank identifier code: Wrong format";
  //     }

  //     // * Usually between 8-12 characters but 5-17 characters possible
  //     if (!/^\d+$/g.test(values.bankAccountNumber.trim())) {
  //       errors.bankAccountNumber =
  //         "Invalid bank account number: Must contain numbers only";
  //     } else if (values.bankAccountNumber.trim().length < 5) {
  //       errors.bankAccountNumber =
  //         "Invalid bank account number: Must contain at least 5 characters";
  //     } else if (values.bankAccountNumber.trim().length > 17) {
  //       errors.bankAccountNumber =
  //         "Invalid bank account number: Must contain at most 17 characters";
  //     }
  //   }
  // }

  // if (values.bankAccountNumber && !values.bankIdentifierCode) {
  //   errors.bankIdentifierCode =
  //     "Please provide a BIC in complement of your bank account number";
  // }
  // if (!values.bankAccountNumber && values.bankIdentifierCode) {
  //   errors.bankAccountNumber =
  //     "Please provide a bank account number in complement of your BIC";
  // }

  // if (
  //   !values.bankIban &&
  //   !values.bankIdentifierCode &&
  //   !values.bankAccountNumber
  // ) {
  //   errors.bankIban =
  //     "Make sure to enter an IBAN if you don't provide a BIC and bank account number";
  //   errors.bankIdentifierCode =
  //     "Make sure to enter a BIC if you don't provide an IBAN";
  //   errors.bankAccountNumber =
  //     "Make sure to enter a bank account number if you don't provide an IBAN";
  // }

  // // ! DOCUMENTS SECTION
  console.log(errors);

  return errors;
};

export default UserDetailsForm
