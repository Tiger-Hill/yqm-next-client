import TextField from "@mui/material/TextField";

const InputMui = ({
  required,
  id,
  width,
  name,
  type,
  multiline,
  label,
  helperText,
  onChangeHandler,
  onBlurHandler,
  error,
  value,
  defaultValue,
  valid,
  disabled,
  quantityInput,
  min, max,
  // isHeaderCard
}) => {
  const quantityInputStyle = quantityInput ?
    { width: "100px", marginTop: "0", "& .MuiInputBase-input": { padding: "2rem 1rem", fontSize: "1.5rem" }}
   :
   {};

  return (
    <TextField
      sx={{
        marginTop: "2rem",
        width: width || "100%",
        minWidth: "none !important",

        "& .MuiInputLabel-root": {
          fontSize: "1.7rem",
          borderRadius: "50rem",
          padding: "0.2rem 1rem",
          backgroundColor: "white",
          // backgroundColor: isHeaderCard ? "rgb(215,215,215)" : "white",
        },

        "& .MuiFormHelperText-root": {
          fontSize: "1.7rem",
          marginTop: "1rem",
          color: "#FF302E",
          backgroundColor: "transparent",
        },

        "& .MuiInputBase-input": {
          fontSize: "1.7rem",
          padding: "2.5rem",
          backgroundColor: "white",
          borderRadius: "4px !important",
        },

        ...quantityInputStyle,
      }}
      required={required}
      id={id}
      name={name}
      // value={value}
      type={type}
      multiline={multiline}
      label={label}
      helperText={helperText}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      valid={(valid && valid.toString()) || undefined}
      error={error}
      defaultValue={defaultValue}
      disabled={disabled}
      inputProps={type === "number" ? { min: min, max: max, step: 1 } : {}}
    />
  );
};

export default InputMui;
