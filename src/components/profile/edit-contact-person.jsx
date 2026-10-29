import { useTranslation } from "react-i18next";
import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const EditContactPerson = ({ control }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{t("ui.contact_person")}</Typography>

      <Controller
        control={control}
        name="personFio"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.full_name")}
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
        name="personPhone"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.phone_2")}
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
        name="personEmail"
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
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
        name="personIin"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.iin")}
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

export default EditContactPerson;
