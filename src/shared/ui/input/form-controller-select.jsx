import { Controller } from "react-hook-form";
import CustomSelect from "./custom-select";

const FormControllerSelect = ({
  name,
  control,
  rules,
  defaultValue,
  onChange,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    defaultValue={defaultValue}
    render={({ field: { ref, ...field }, fieldState }) => (
      <CustomSelect
        {...field}
        inputRef={ref}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message}
        {...props}
        onChange={(event) => {
          field.onChange(event);
          onChange?.(event);
        }}
      />
    )}
  />
);

export default FormControllerSelect;
