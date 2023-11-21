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


import modalClasses from "@/components/modals/Modal.module.scss";

const validate = values => {
  const errors = {};

  if (!values.productName) {
    errors.productName = "Provide the product name";
  }
  // else if (values.productName.length > 15) {
  //   errors.productName = "Must be 15 characters or less";
  // }

  if (!values.productDescription) {
    errors.productDescription = "Provide the product description";
  } else if (values.productDescription.length < 10) {
    errors.productDescription = "Must be 10 characters or less";
  }

  if (!values.productStatus) {
    errors.productStatus = "Provide the product status";
  } else if (!["in stock", "out of stock", "hidden"].includes(values.productStatus)) {
    errors.productStatus = "This product status is not valid";
  }

  return errors;
}

const NewProductForm = ({ showNewProductModalHandler }) => {
  const dispatch = useDispatch();
  // const { notification } = useSelector(state => state.rootReducer.admin);

  const formik = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      productStatus: "hidden",
      comments: ""
      // productImage: "",
    },
    validate,
    onSubmit: values => {
      if (!productImageFileToUpload) {
        setErrorProductFile("No file attached");
        return;
      }

      const product = {
        ...values,
        image: productImageFileToUpload,
      }

      console.log(values);

      dispatch(createProduct(product));
      showNewProductModalHandler("close");
    },
  });

  // useEffect(() => {
  //   if (notification.flash_code) {
  //     notification.flash_code === "CREATE_PRODUCT_SUCCESS" && showNewProductModalHandler("close");
  //   }
  // }, [notification.flash_code])



  // ! PRODUCT IMAGE FILE SETUP
  // const [existingPassportFile, setExistingPassportFile] = useState(null);
  const [productImageFileToUpload, setProductImageFileToUpload] = useState(null);
  const [productImageFileBlobUrl, setProductImageFileBlobUrl] = useState(null);
  const [errorProductFile, setErrorProductFile] = useState(null);

  // ! PRODUCT IMAGE FILE HANDLER
  const changeProductFileHandler = e => {
    console.clear();
    console.log(e.target.files[0].type);

    if (e.target.files.length > 0) {
      if (e.target.files[0].size > 10485760) {
        // ! THE SIZE FILED IS IN BYTES (size ÷ 1024 ÷ 2014 TO GET MB SIZE)
        // ! 10485760 bytes = 10MB
        // ? https://www.gbmb.org/bytes-to-mb
        setErrorProductFile("The file size is too big (max 10MB)");
        setProductImageFileToUpload(null);
      } else if (
        !/(jpg)$|(jpeg)$|(png)$/g.test(e.target.files[0].type)
      ) {
        setErrorProductFile(
          "Invalid format. allowed format are .JPG, .JPEG and .PNG"
        );
        setProductImageFileToUpload(null);
      } else {
        setErrorProductFile(null);
        setProductImageFileToUpload(e.target.files[0]);
      }
    } else {
      setProductImageFileToUpload(null);
      setErrorProductFile("No file attached");
    }
  };

  // ! CREATE LINKS FOR THE FILES. WE USE THE LINK TO RENDER THE ATTACHED DOCUMENT FOR THE USER (UX)
  useEffect(() => {
    //  * PASSPORT URL SETUP
    productImageFileToUpload ? setProductImageFileBlobUrl(URL.createObjectURL(productImageFileToUpload)) : setProductImageFileBlobUrl(null);

  }, [productImageFileToUpload]);

  // ! FILE ERROR HANDLER
  const fileErrorHandler = e => {
    if (/product/g.test(e.target.alt)) {
      setErrorProductFile(
        `"${productImageFileToUpload.name}": This file is corrupted, please select another file.`
      );
      setProductImageFileToUpload(null);
      setProductImageFileBlobUrl(null);
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
        <Image
          src="/SVGS/create.svg"
          alt="plus icon for 'add a product'"
          width={200}
          height={200}
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

          <ButtonMui
            width="fit-content"
            height="5rem"
            marginTop="2rem"
            fontSize="1.7rem"
            backgroundColor="#f8ae01"
            color="white"
            disabledBakcgroundColor="#DCDCDC"
            disabledColor="white"
            type="button"
            disabled={false}
            text="Product Image (.JPG, .JPEG and .PNG)"
            onClickHandler={() => {}}
            onChangeHandler={changeProductFileHandler}
            isFileButton={true}
          />

          {/* // ? IF THERE'S A NEW FILE TO UPLOAD (DOESN'T MATTER IF THERE'S AN EXISTING FILE OR NOT)  */}
          {productImageFileToUpload && (
            <p className="file-message-success">{productImageFileToUpload.name}</p>
          )}

          {errorProductFile && (
            <p className="file-message-error">{errorProductFile}</p>
          )}

          {/* // ! PRODUCT IMAGE IMG RENDERING */}
          {/* // * RENDERING NEW FILE */}
          {productImageFileToUpload &&
            /\/pdf$/g.test(productImageFileToUpload.type) === false &&
            !errorProductFile && (
              <img
                src={productImageFileBlobUrl}
                alt="product image"
                onError={fileErrorHandler}
              />
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
