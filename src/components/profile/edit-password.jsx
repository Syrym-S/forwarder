import { useTranslation } from "react-i18next";
import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditPassword = ({ control }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{t("ui.change_password")}</Typography>

      <Controller
        control={control}
        name="currentPassword"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.current_password")}
            type="password"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.new_password")}
            type="password"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="newPasswordConfirm"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.repeat_new_password")}
            type="password"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />
    </Stack>
  );
};

export default EditPassword;
