import { TextField } from "@mui/material";

const FormInput = ({ field, slotProps, ...props }) => {
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
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default FormInput;
