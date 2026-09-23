import { Button, CircularProgress } from "@mui/material";

const PrimaryButton = ({
  isLoading = false,
  onClick,
  warning = false,
  error = false,
  text,
  variant = "contained",
  disabled = false,
  sx = {},
  size = "large",
  ...props
}) => {
  const color = error ? "error" : warning ? "warning" : "primary";

  const getBoxShadow = () => {
    if (error) {
      return "0 4px 10px rgba(211, 47, 47, 0.25)";
    }

    if (warning) {
      return "0 4px 10px rgba(237, 108, 2, 0.25)";
    }

    return "0 4px 10px rgba(175, 198, 230, 0.25)";
  };

  return (
    <Button
      size={size}
      disabled={isLoading || disabled}
      onClick={onClick}
      variant={variant}
      color={color}
      sx={{
        fontSize: "0.9rem",
        fontWeight: 400,
        textTransform: "none",
        gap: 1,
        borderRadius: 2,

        ...sx,
      }}
      {...props}
    >
      {isLoading && <CircularProgress size={13} color="inherit" />}

      {text}
    </Button>
  );
};

export default PrimaryButton;
