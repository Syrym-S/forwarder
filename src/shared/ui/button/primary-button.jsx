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
