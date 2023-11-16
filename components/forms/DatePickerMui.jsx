// "use client";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateField } from "@mui/x-date-pickers/DateField";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

import dayjs from "dayjs";


const DatePickerMui = ({
  required,
  label,
  inputName,
  // onChangeHandler,
  // onBlurHandler,
  value,
  formik,
  disableFuture,
  disablePast,
  helperText
  // defaultValue,
}) => {
  const datePickerStyles = {
    // ! CALENDAR POPUP STYLE FIXED IN global.scss

    minWidth: "100%",
    paddingTop: "none !important",
    backgroundColor: "white",
    borderRadius: "4px !important",

    "& .MuiFormControl-root": {
      backgroundColor: "red",
    },

    "& .MuiInputLabel-root": {
      fontSize: "1.7rem",
      borderRadius: "50rem",
      padding: "0.2rem 1rem",
      backgroundColor: "white",
    },

    "& .MuiFormHelperText-root": {
      fontSize: "1.7rem",
      marginTop: "1rem",
    },

    "& .MuiInputBase-input": {
      fontSize: "1.7rem",
      padding: "1.7819rem",
      fontSize: "1.7rem",
      padding: "2.5rem",
    },

    "& .MuiSvgIcon-root": {
      width: "2rem",
      height: "2rem",
    },
  };

  console.log(value);

  return (
    <FormControl
      sx={{
        minWidth: "100%",
        marginTop: "1.2rem",

        "& .MuiInputLabel-root": {
          fontSize: "1.7rem",
          backgroundColor: "white",
        },

        "& .MuiFormHelperText-root": {
          fontSize: "1.7rem",
          marginTop: "1rem",
          backgroundColor: "white",
        },

        "& .MuiInputBase-input": {
          fontSize: "1.7rem",
          padding: "1.7819rem",
        },

        "& .MuiStack-root": {
          width: "100%",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DemoItem valueType="date">
            <DatePicker
              required={required}
              sx={datePickerStyles}
              label={label}
              onChange={date =>
                formik.setFieldValue(inputName, date.format("YYYY-MM-DD"))
              }
              textField={params => <TextField {...params} />}
              value={dayjs(value)}
              disableFuture={disableFuture}
              disablePast={disablePast}
            />

            {/* // ! Without popup datepicker. just the input */}
            {/* <DateField
              required={required}
              sx={datePickerStyles}
              label={label}
              onChange={date => formik.setFieldValue("birthDate", date.format('YYYY-MM-DD'))}
              renderInput={params => <TextField {...params} />}
              value={dayjs(value)}
            /> */}
            {helperText && <FormHelperText>{`${helperText}`}</FormHelperText>}
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </FormControl>
  );
};

export default DatePickerMui;
