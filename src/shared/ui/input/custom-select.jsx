import { MenuItem, TextField } from "@mui/material";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 42,
    borderRadius: 2.5,
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#172B4D",
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: "#DFE1E6" },
    "&:hover:not(.Mui-disabled):not(.Mui-error)": {
      backgroundColor: "#FAFBFC",
      "& fieldset": { borderColor: "#B3BAC5" },
    },
    "&.Mui-focused:not(.Mui-error)": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.08)",
      "& fieldset": { borderColor: "primary.main", borderWidth: 1.5 },
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    py: 1,
    px: 1.5,
  },
  "& .MuiSelect-icon": { color: "#6B778C", right: 10 },
};

const menuStyles = {
  mt: 0.7,
  borderRadius: 2.5,
  border: "1px solid #DFE1E6",
  boxShadow: "0px 8px 24px rgba(9, 30, 66, 0.15)",
  p: 0.5,
};

const optionStyles = {
  minHeight: 40,
  px: 1.5,
  py: 1,
  borderRadius: 1.5,
  fontSize: "0.9rem",
  color: "#172B4D",
  fontWeight: 500,
  transition: "background-color 0.15s ease",
  "&:hover": { backgroundColor: "#F4F5F7" },
  "&.Mui-selected": {
    color: "primary.main",
    backgroundColor: "#EAF1FB",
    fontWeight: 600,
  },
  "&.Mui-selected:hover": { backgroundColor: "#E2ECFA" },
};

/** Options: { value: string | number, label: ReactNode, disabled?: boolean }[]. */
const CustomSelect = ({ options = [], sx = [], slotProps = {}, ...props }) => (
  <TextField
    size="small"
    {...props}
    select
    sx={[fieldStyles, ...(Array.isArray(sx) ? sx : [sx])]}
    slotProps={{
      ...slotProps,
      select: (ownerState) => {
        const selectProps =
          typeof slotProps.select === "function"
            ? slotProps.select(ownerState)
            : slotProps.select;
        const menuProps = selectProps?.MenuProps;

        return {
          ...selectProps,
          MenuProps: {
            ...menuProps,
            slotProps: {
              ...menuProps?.slotProps,
              paper: (paperOwnerState) => {
                const paperSlot = menuProps?.slotProps?.paper;
                const paperProps =
                  typeof paperSlot === "function"
                    ? paperSlot(paperOwnerState)
                    : paperSlot;
                const paperSx = paperProps?.sx ?? [];

                return {
                  ...paperProps,
                  sx: [
                    menuStyles,
                    ...(Array.isArray(paperSx) ? paperSx : [paperSx]),
                  ],
                };
              },
            },
          },
        };
      },
    }}
  >
    {options.map(({ value, label, disabled }) => (
      <MenuItem key={value} value={value} disabled={disabled} sx={optionStyles}>
        {label}
      </MenuItem>
    ))}
  </TextField>
);

export default CustomSelect;
