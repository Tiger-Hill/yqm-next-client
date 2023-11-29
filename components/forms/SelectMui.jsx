"use client";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { WidthFull } from "@mui/icons-material";


const SelectMui = ({
  required,
  id,
  labelId,
  inputLabel,
  value,
  name,
  label,
  helperText,
  onChangeHandler,
  onBlurHandler,
  error,
  defaultValue,
  valid,
  emptyValue,
  emptyValueText,
  menuItems,
  disabled
}) => {

  const emptyFunction = () => {};

  return (
    <FormControl
      sx={{
        minWidth: "100%",
        maxWidth: "100%",
        marginTop: "2rem",

        "& .MuiInputLabel-root": {
          fontSize: "1.7rem",
          backgroundColor: "white",
          borderRadius: "50rem",
          padding: "0.2rem 1rem",
          backgroundColor: "white",
        },

        "& .MuiFormHelperText-root": {
          fontSize: "1.7rem",
          marginTop: "1rem",
          backgroundColor: "transparent",
          color: "#FF302E",
        },

        "& .MuiInputBase-input": {
          fontSize: "1.7rem",
          padding: "1.7819rem",
          backgroundColor: "white",
          borderRadius: "4px",
        },
      }}
    >
      <InputLabel id={labelId} required={required} value={value}>
        {inputLabel}
      </InputLabel>

      <Select
        MenuProps={{
          sx: {
            zIndex: "9999999 !important",
          },

          PaperProps: {
            sx: {
              "& .MuiMenuItem-root": {
                fontSize: "1.7rem",
                whiteSpace: "nowrap", // Prevent text from wrapping
                overflow: "hidden", // Hide overflowing text
                textOverflow: "ellipsis", // Show ellipsis for long text
              },
            },
          },
        }}
        value={value}
        required={required}
        labelId={labelId}
        id={id}
        name={name}
        label={label}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        valid={(valid && valid.toString()) || undefined}
        error={error}
        disabled={disabled}
        autoWidth
        // defaultValue={defaultValue || ""}
        // menuItems={menuItems}
      >
        {/* // * IN CASE THERE'S A NEED FOR AN EMPTY SELECT OPTION */}
        {emptyValue && <MenuItem value="">{emptyValueText}</MenuItem>}

        {/* // * RENDERS ALL THE DIFFERENT OPTIONS PROGRAMMATICALY */}
        {menuItems.map((item, i) => (
          <MenuItem
            value={item.value}
            key={`${item.value}${i}`}
            disabled={item.value === ""}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{`${helperText}`}</FormHelperText>}
    </FormControl>
  );
};

export default SelectMui;
