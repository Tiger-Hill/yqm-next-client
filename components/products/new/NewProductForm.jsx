"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/lib/redux/slices/productSlice";
import { useFormik } from "formik";
import { motion } from "framer-motion";

import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import ButtonMui from "@/components/forms/ButtonMui";

import classes from "./NewProductForm.module.scss";

const validate = values => {
  const errors = {};

  // TODO VALIDATIONS

  return errors;
};

const NewProductForm = ({ lng }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      productCreatorPrice: "1",
      productCreatorUrl: "",
      comments: "",
      // images
    },
    validate,
    onSubmit: values => {
      console.log(productFilesToUpload);

      if (!productFilesToUpload || productFilesToUpload.length === 0) {
        setErrorProductFiles("Please provide at least one image for the product");
        return;
      }

      const newProduct = {
        ...values,
        images: productFilesToUpload,
      }

      console.log("newProduct", newProduct);
      dispatch(createProduct(newProduct));
    },
  });


  // ! PRODUCT IMAGES FILES
  // const [existingPassportFile, setExistingPassportFile] = useState(passportFileInfo);
  const [productFilesToUpload, setProductFilesToUpload] = useState(null);
  // const [passportFileBlobUrl, setPassportFileBlobUrl] = useState(null);
  const [errorProductFiles, setErrorProductFiles] = useState(null);
  console.log(typeof(productFilesToUpload));

  // ! PRODUCT IMAGES FILES HANDLER
  const changeFilesHandler = e => {
    console.log(e.target.files);
    const filesToUpload = [];

    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        console.log(e.target.files[i].type);

        if (e.target.files[i].size > 2097152) {
          // ! THE SIZE FILED IS IN BYTES (size ÷ 1024 ÷ 2014 TO GET MB SIZE)
          // ! 10485760 bytes = 10MB || 1MB = 1048576 bytes || ! 2MB = 2097152 bytes
          // ? https://www.gbmb.org/bytes-to-mb
          setErrorProductFiles("A file is too large. Max size is 2MB");
          setProductFilesToUpload(null);
          return;
        } else if (!/(jpg)$|(jpeg)$|(png)$/g.test(e.target.files[i].type)) {
          setErrorProductFiles(
            "One or more files have an invalid format. Allowed format: .JPG, .JPEG, .PNG"
          );
          setProductFilesToUpload(null);
          return;
        } else {
          filesToUpload.push(e.target.files[i]);
        }
      }

      setErrorProductFiles(null);
      setProductFilesToUpload(filesToUpload);
    } else {
      setProductFilesToUpload(null);
      setErrorProductFiles("No file attached");
    }
  };

  return (
    <section>
      <header className={classes["public-page-header"]}>
        <Image
          src="/IMGS/create-new-product.jpg"
          alt="A man looking towards a mountain. We can see a city in between bathed in sunset light."
          width={4000}
          height={4000}
        />

        <div className={classes["header-content"]}>
          <motion.h1
            transition={{ duration: 0.25 }}
            initial={{ opacity: 0, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: "auto" }}
          >
            Make a new wishable product!
          </motion.h1>
        </div>
      </header>

      <motion.form
        className={classes["formik-form"]}
        onSubmit={formik.handleSubmit}
        key="user-detail-form"
        data-testid="login-formik-form"
        transition={{ duration: 0.25 }}
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: "auto" }}
      >
        <h2>Contribute to the community by making a new product available to everyone!</h2>

        <p>
          Please provide some details about the product you'd like to wish for.
          <br />
          We'll then review your request and, if it meets our criteria, make it
          available for others to wish for as well.
        </p>

        <InputMui
          required={true}
          id="outlined-disabled productName"
          name="productName"
          type="text"
          label="Product name"
          helperText={formik.errors.productName && formik.errors.productName}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.productName && !!formik.errors.productName}
          valid={!!formik.touched.productName && !formik.errors.productName}
          disabled={false}
          defaultValue={formik.values.productName}
        />

        <InputMui
          required={true}
          id="outlined-disabled productDescription"
          name="productDescription"
          type="text"
          label="Product description"
          helperText={
            formik.errors.productDescription && formik.errors.productDescription
          }
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={
            !!formik.touched.productDescription &&
            !!formik.errors.productDescription
          }
          valid={
            !!formik.touched.productDescription &&
            !formik.errors.productDescription
          }
          disabled={false}
          defaultValue={formik.values.productDescription}
        />

        <InputMui
          required
          id="outlined-required productCreatorPrice"
          name="productCreatorPrice"
          type="text"
          // min="1"
          // max={Infinity}
          label="Wished price"
          helperText={
            formik.errors.productCreatorPrice &&
            formik.errors.productCreatorPrice
          }
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={
            !!formik.touched.productCreatorPrice &&
            !!formik.errors.productCreatorPrice
          }
          valid={
            !!formik.touched.productCreatorPrice &&
            !formik.errors.productCreatorPrice
          }
          disabled={false}
          defaultValue={formik.values.productCreatorPrice}
        />

        <InputMui
          required={true}
          id="outlined-disabled productCreatorUrl"
          name="productCreatorUrl"
          type="url"
          label="Product/Similar product URL"
          helperText={
            formik.errors.productCreatorUrl && formik.errors.productCreatorUrl
          }
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={
            !!formik.touched.productCreatorUrl &&
            !!formik.errors.productCreatorUrl
          }
          valid={
            !!formik.touched.productCreatorUrl &&
            !formik.errors.productCreatorUrl
          }
          disabled={false}
          defaultValue={formik.values.productCreatorUrl}
        />

        <InputMui
          required={true}
          id="outlined-disabled comments"
          name="comments"
          type="text"
          label="Comments"
          helperText={formik.errors.comments && formik.errors.comments}
          onChangeHandler={formik.handleChange}
          onBlurHandler={formik.handleBlur}
          error={!!formik.touched.comments && !!formik.errors.comments}
          valid={!!formik.touched.comments && !formik.errors.comments}
          disabled={false}
          defaultValue={formik.values.comments}
        />

        <ButtonMui
          width="fit-content"
          display="block"
          height="5rem"
          marginTop="2rem"
          fontSize="1.8rem"
          backgroundColor="#f8ae01"
          color="white"
          disabledBakcgroundColor="#DCDCDC"
          disabledColor="white"
          type="button"
          disabled={false}
          text="Upload product images (.JPG, .JPEG, .PNG and .PDF)"
          onClickHandler={() => {}}
          onChangeHandler={changeFilesHandler}
          isFileButton={true}
          multiple={true}
        />
        {errorProductFiles && (
          <p className={classes["error-msg"]}>{errorProductFiles}</p>
        )}

        {productFilesToUpload && productFilesToUpload.length > 0 && (
          <>
            <p className={classes["success-msg"]}>
              {productFilesToUpload.length} file
              {productFilesToUpload.length > 1 && "s"} ready to be uploaded
            </p>

            <div className={classes["uploaded-files-container"]}>
              {productFilesToUpload.map((file, index) => {
                return (
                  <Image
                    key={index}
                    alt={file.name}
                    className={classes["uploaded-file"]}
                    width={200}
                    height={200}
                    src={URL.createObjectURL(file)}
                  />
                );
              })}
            </div>
          </>
        )}

        <br />

        <ButtonMui
          width="100%"
          height="auto"
          marginTop="4rem"
          fontSize="1.8rem"
          backgroundColor="#f8ae01"
          color="white"
          disabledBakcgroundColor="#DCDCDC"
          disabledColor="white"
          type="submit"
          disabled={false}
          text={"Submit new product"}
          onClickHandler={() => {}}
        />
      </motion.form>
    </section>
  );
}

export default NewProductForm
