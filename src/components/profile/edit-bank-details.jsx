import { useTranslation } from "react-i18next";
import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditBankDetails = ({ control }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{t("ui.bank_details")}</Typography>

      <Controller
        control={control}
        name="companyAccount"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.current_account_2")}
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
        name="companyBik"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.bic")}
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

export default EditBankDetails;
