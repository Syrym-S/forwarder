import { useTranslation } from "react-i18next";
import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditCompanyFileds = ({ control }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{t("ui.company")}</Typography>

      <Controller
        control={control}
        name="companyName"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.company_name")}
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
        name="companyBin"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.company_bin")}
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
        name="companyAddress"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.registered_address")}
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

export default EditCompanyFileds;
