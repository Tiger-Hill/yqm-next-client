import Button from "@mui/material/Button";

const ButtonMUI = ({ color, backgroundColor, width, height, borderRadius, text, type, disabled }) => {
  return (
    <Button
      sx={{
        width: width,
        height: height,
        marginTop: "2rem",
        fontSize: "1.7rem",
        backgroundColor: `${backgroundColor} !important`,
        color: `${color} !important`,
        height: height,
        borderRadius: borderRadius,
        position: "relative",
        zIndex: 500,

        "&:hover": {
          boxShadow: "0 5px 10px rgba(0,0,0,0.25)",
          cursor: "not-allowed !important",
        },
      }}
      type={type}
      disabled={disabled}
      size="large"
    >
      {text}
    </Button>
  );
};

export default ButtonMUI;
