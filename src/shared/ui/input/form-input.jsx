import { TextField } from "@mui/material";

const FormInput = ({ field, slotProps, sx, ...props }) => {
  return (
    <TextField
      {...field}
      {...props}
      slotProps={{
        ...slotProps,
        inputLabel: {
          shrink: true,
          ...slotProps?.inputLabel,
        },
      }}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default FormInput;
