import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditBankDetails = ({ control }) => {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Банковские реквизиты</Typography>

      <Controller
        control={control}
        name="companyAccount"
        render={({ field }) => (
          <TextField
            {...field}
            label="Расчетный счет"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
          />
        )}
      />

      <Controller
        control={control}
        name="companyBik"
        render={({ field }) => (
          <TextField
            {...field}
            label="БИК"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export default EditBankDetails;
