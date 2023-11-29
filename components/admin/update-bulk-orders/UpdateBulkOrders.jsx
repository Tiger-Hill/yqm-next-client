"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUpdateOrdersCsv, resetOrderRowsToUpdate, persistUpdateOrdersCsv } from "@/lib/redux/slices/adminSlice";

import SelectMui from "@/components/forms/SelectMui";
import ButtonMui from "@/components/forms/ButtonMui";
import classes from  "./UpdateBulkOrders.module.scss";


const UpdateBulkOrders = ({ lng }) => {
  const dispatch = useDispatch();
  const { ordersRowsToUpdate, orderRowsAreValid } = useSelector(state => state.rootReducer.admin);

  // console.log(orderRowsToUpdate, orderRowsAreValid);

  // ! Select input handler
  const [targetedStatus, setTargetedStatus] = useState("Awaiting other orders");

  const searchInputHandler = e => {
    if (!e.target.value) {
      setTargetedStatus("");
    } else {
      setTargetedStatus(e.target.value);
    }
  };

  // ! CSV FILE HANDLING
  const [csvFileToUpload, setCsvFileToUpload] = useState(null);
  const [errorCsvFile, setErrorCsvFile] = useState(null);

  // ! PRODUCT IMAGES FILES HANDLER
  const changeFilesHandler = e => {
    console.log(e.target.files);

    if (e.target.files.length > 0) {
      if (e.target.files[0].size > 10485760) {
        // ! THE SIZE FILED IS IN BYTES (size ÷ 1024 ÷ 2014 TO GET MB SIZE)
        // ! 10485760 bytes = 10MB || 1MB = 1048576 bytes || ! 2MB = 2097152 bytes
        // ? https://www.gbmb.org/bytes-to-mb
        setErrorCsvFile("A file is too large. Max size is 10MB");
        setCsvFileToUpload(null);
        return;
      } else if (!/(csv)$/g.test(e.target.files[0].type)) {
        setErrorCsvFile(
          "One or more files have an invalid format. Allowed format: .CSV"
        );
        setCsvFileToUpload(null);
        return;
      } else {
        setErrorCsvFile(null);
        setCsvFileToUpload(e.target.files[0]);
      }
    } else {
      setCsvFileToUpload(null);
      setErrorCsvFile("No file attached");
    }
  };

  const updateAllOrderStatusHandler = () => {
    setIsUploaded(true);
    dispatch(checkUpdateOrdersCsv(targetedStatus, csvFileToUpload));
  }

  const cancelUploadHandler = () => {
    setIsUploaded(false);
    setCsvFileToUpload(null);
    setErrorCsvFile(null);
    dispatch(resetOrderRowsToUpdate());
  }

  const persistCsvDataHandler = () => {
    dispatch(persistUpdateOrdersCsv(ordersRowsToUpdate));

    // ! We reset the file and the redux store after sending the request to the server
    setIsUploaded(false);
    setCsvFileToUpload(null);
    setErrorCsvFile(null);
    dispatch(resetOrderRowsToUpdate());
  }

  // ! PAGE STATES MANAGMENT
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className={classes["update-bulk-orders-container"]}>
      <h3>Update Bulk Orders</h3>

      {!isUploaded && (
        <>
          <SelectMui
            required={true}
            id="outlined-required currency"
            name="target-status"
            label="target-status"
            onChangeHandler={e => searchInputHandler(e)}
            labelId="target-status"
            value={"Awaiting other orders"}
            emptyValue={false}
            emptyValueText={null}
            menuItems={[
              {
                value: "Awaiting other orders",
                label: "Awaiting other orders",
              },
              { value: "Packaging", label: "Packaging" },
              {
                value: "Dispatched from supplier",
                label: "Dispatched from supplier",
              },
              {
                value: "Awaiting customs clearance",
                label: "Awaiting customs clearance",
              },
              { value: "Delivering to you", label: "Delivering to you" },
              { value: "Delivered", label: "Delivered" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            inputLabel={"Target status for all CSV file orders"}
            // defaultValue={formik.touched.currency}
          />

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
            text="Orders to update CSV (.CSV)"
            onClickHandler={() => {}}
            onChangeHandler={changeFilesHandler}
            isFileButton={true}
            multiple={false}
          />

          {errorCsvFile && <p className={classes["error"]}>{errorCsvFile}</p>}
          {!errorCsvFile && csvFileToUpload && (
            <p className={classes["success"]}>{csvFileToUpload.name}</p>
          )}

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
            disabled={false}
            text="Update all orders status"
            onClickHandler={() => updateAllOrderStatusHandler()}
          />
        </>
      )}

      {isUploaded && ordersRowsToUpdate && (
        <>
          {orderRowsAreValid && (
            <>
              <p>
                The data your provided is valid. Proceed to update the orders
                status to <strong>{targetedStatus}</strong> for all orders in
                the CSV file?
              </p>

              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="2rem"
                fontSize="1.7rem"
                backgroundColor="#3CA94E"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="submit"
                disabled={false}
                text="Proceed"
                onClickHandler={() => persistCsvDataHandler()}
              />

              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="2rem"
                fontSize="1.7rem"
                backgroundColor="#FF302E"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="submit"
                disabled={false}
                text="Cancel"
                onClickHandler={() => cancelUploadHandler()}
              />
            </>
          )}

          {!orderRowsAreValid && (
            <>
              <p>
                The data your provided is invalid. Please check the content of
                your CSV file and try again.
              </p>

              <p>
                (I'll add a table here soon to make it easier for you to see
                what cells are invalid)
              </p>

              <ButtonMui
                width="100%"
                height="5rem"
                marginTop="2rem"
                fontSize="1.7rem"
                backgroundColor="#FF302E"
                color="white"
                disabledBakcgroundColor="#DCDCDC"
                disabledColor="white"
                type="submit"
                disabled={false}
                text="Cancel"
                onClickHandler={() => cancelUploadHandler()}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UpdateBulkOrders

// ! (DONE) I click on the submit button, the CSV file is still accessible but i send a request to the server to check its content.
// ! Once i receive the data back, i extract it from redux and render a table to show its content. I loop through the object to render the table with color coding for acceptable/unacceptable cells.
// ! if there's any unacceptable cell, i disable the submit button make it possible to cancel to come back to the form where to upload csv
// ! if all cells are acceptable, i enable the submit button and send the data to the server to update the orders status
