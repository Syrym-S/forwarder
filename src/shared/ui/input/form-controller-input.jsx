import FormInput from "./form-input";
import { Controller } from "react-hook-form";

const FormControllerInput = ({ name, control, rules, onChange, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormInput
          field={field}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormControllerInput;
