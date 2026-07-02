import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditPassword = ({ control }) => {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Смена пароля</Typography>

      <Controller
        control={control}
        name="currentPassword"
        render={({ field }) => (
          <TextField
            {...field}
            label="Текущий пароль"
            type="password"
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
        name="newPassword"
        render={({ field }) => (
          <TextField
            {...field}
            label="Новый пароль"
            type="password"
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
        name="newPasswordConfirm"
        render={({ field }) => (
          <TextField
            {...field}
            label="Повторите новый пароль"
            type="password"
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

export default EditPassword;
