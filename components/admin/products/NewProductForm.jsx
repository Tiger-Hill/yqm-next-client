"use client";

import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/lib/redux/slices/adminSlice";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";

import Image from "next/image";
import InputMui from "@/components/forms/InputMui";
import SelectMui from "@/components/forms/SelectMui";
import ButtonMui from "@/components/forms/ButtonMui";
import CloseIcon from "@mui/icons-material/Close";

import classes from "@/components/products/new/NewProductForm.module.scss";
import modalClasses from "@/components/modals/Modal.module.scss";

const validate = values => {
  const errors = {};

  if (!values.productName) {
    errors.productName = "Please provide a product name";
  } else if (values.productName.length < 3) {
    errors.productName = "The product name must be at least 3 characters long";
  }

  if (!values.productDescription) {
    errors.productDescription = "Please provide a product description";
  } else if (values.productDescription.length < 3) {
    errors.productDescription = "The product description must be at least 3 characters long";
  }

  if (!values.productCreatorPrice) {
    errors.productCreatorPrice = "Please provide a wished price";
  } else if (values.productCreatorPrice < 1) {
    errors.productCreatorPrice = "The wished price must be at least 1";
  } else if (!/^[0-9]+(\.[0-9]{1,2})?$/g.test(values.productCreatorPrice)) {
    errors.productCreatorPrice = "The wished price must be a number with a maximum of 2 decimals";
  }

  if (!values.productCreatorUrl) {
    errors.productCreatorUrl = "Please provide a product URL";
  }

  if (!values.comments) {
    errors.comments = "Please provide some comments";
  } else if (values.comments.length < 3) {
    errors.comments = "The comments must be at least 3 characters long";
  }

  console.log(errors);
  return errors;
}

const NewProductForm = ({ showNewProductModalHandler }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      productName: "",
      productStatus: "hidden",
      productDescription: "",
      productCreatorPrice: 1,
      productCreatorUrl: "",
      comments: "",
      // images
    },
    validate,
    onSubmit: values => {
      // ! If there is no file attached, we don't update the product
      if (!productFilesToUpload || productFilesToUpload.length === 0) {
        setErrorProductFiles(
          "Please provide at least one image for the product"
        );
        return;
      }

      const product = {
        ...values,
        images: productFilesToUpload,
      };

      dispatch(createProduct(product));
      showNewProductModalHandler("close");
    },
  });

  // ! PRODUCT IMAGES FILES
  // const [existingPassportFile, setExistingPassportFile] = useState(passportFileInfo);
  const [productFilesToUpload, setProductFilesToUpload] = useState(null);
  // const [passportFileBlobUrl, setPassportFileBlobUrl] = useState(null);
  const [errorProductFiles, setErrorProductFiles] = useState(null);

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
    <motion.div
      className={modalClasses.backdrop}
      onClick={() => showNewProductModalHandler("close")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={modalClasses.content}
        onClick={e => e.stopPropagation()}
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
        transition={{ duration: 0.25 }}
      >
        <CloseIcon
          className={modalClasses["close-icon"]}
          onClick={() => showNewProductModalHandler("close")}
        />
        <h4>Add a new product</h4>

        <form onSubmit={formik.handleSubmit}>
          <InputMui
            required={true}
            id="outlined-disabled productName"
            name="productName"
            type="text"
            label="Product Name"
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
            multiline={true}
            label="Product Decription"
            helperText={
              formik.errors.productDescription &&
              formik.errors.productDescription
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

          <SelectMui
            required={true}
            id="outlined-required productStatus"
            name="productStatus"
            // label="productStatus"
            helperText={
              formik.errors.productStatus && formik.errors.productStatus
            }
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={
              !!formik.touched.productStatus && !!formik.errors.productStatus
            }
            valid={
              !!formik.touched.productStatus && !formik.errors.productStatus
            }
            labelId="productStatus-label"
            value={formik.values.productStatus}
            emptyValue={false}
            emptyValueText={null}
            menuItems={[
              // { value: "client wish", label: "Client Wish" },
              { value: "for wishing", label: "Wish product" },
              { value: "in stock", label: "In Stock" },
              { value: "out of stock", label: "Out Of Stock" },
              { value: "hidden", label: "Hidden" },
            ]}
            inputLabel={"productStatus"}
            // defaultValue={formik.touched.productStatus}
          />

          <InputMui
            required={false}
            id="outlined-disabled comments"
            name="comments"
            type="text"
            multiline={true}
            label="Comments"
            helperText={formik.errors.comments && formik.errors.comments}
            onChangeHandler={formik.handleChange}
            onBlurHandler={formik.handleBlur}
            error={!!formik.touched.comments && !!formik.errors.comments}
            valid={!!formik.touched.comments && !formik.errors.comments}
            disabled={false}
            defaultValue={formik.values.comments}
          />


          <p className={classes["not-optional-images-msg"]}>
            ⚠️ As an admin, you need to upload at least one picture of the product
          </p>

          <ButtonMui
            width="fit-content"
            height="5rem"
            marginTop="0.5rem"
            fontSize="1.7rem"
            backgroundColor="#f8ae01"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="button"
            disabled={false}
            text="Product Images (.JPG, .JPEG, .PNG)"
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
            disabled={false}
            text="Add this product"
            onClickHandler={() => {}}
          />
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewProductForm;
