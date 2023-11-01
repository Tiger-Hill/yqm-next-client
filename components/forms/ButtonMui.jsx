"use client";

import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from "@mui/material/styles";



const ButtonMui = ({
  width,
  maxWidth,
  height,
  // centered,
  marginTop,
  fontSize,
  backgroundColor,
  color,
  disabledBakcgroundColor,
  disabledColor,
  type,
  disabled,
  size,
  text,
  onClickHandler,
  onChangeHandler,
  isFileButton
}) => {

  // ! This is used to style ab invisible input element when "isFileButton" prop is true
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Button
      startIcon={isFileButton && <CloudUploadIcon />}
      component={isFileButton && "label"}
      sx={{
        width: width,
        maxWidth: maxWidth,
        height: height,
        marginTop: marginTop,
        // margin: centered ? "0 auto" : "0",
        padding: "1rem 2rem",
        fontSize: fontSize,
        backgroundColor: `${backgroundColor} !important`,
        color: `${color} !important`,

        "&:disabled": {
          backgroundColor: `${disabledBakcgroundColor} !important`,
          pointerEvents: "unset",
          color: `${disabledColor} !important`,
          boxShadow: "0 0 0 rgba(0,0,0,0) !important",

          "&:hover": {
            cursor: "not-allowed",
          },
        },

        "&:hover": {
          boxShadow: "0 5px 10px rgba(0,0,0,0.25)",
        },
      }}
      type={type}
      disabled={disabled}
      onClick={() => onClickHandler()}
      onChange={(e) => onChangeHandler(e)}
      // size={size}
    >
      {text}
      {isFileButton && <VisuallyHiddenInput type="file" />}
    </Button>
  );
};

export default ButtonMui;
