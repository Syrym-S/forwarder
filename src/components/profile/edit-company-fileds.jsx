import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditCompanyFileds = ({ control }) => {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Компания</Typography>

      <Controller
        control={control}
        name="companyName"
        render={({ field }) => (
          <TextField
            {...field}
            label="Название компании"
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
        name="companyBin"
        render={({ field }) => (
          <TextField
            {...field}
            label="БИН компании"
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
        name="companyAddress"
        render={({ field }) => (
          <TextField
            {...field}
            label="Юридический адрес"
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

export default EditCompanyFileds;
