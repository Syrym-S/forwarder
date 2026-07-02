import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const EditContactPerson = ({ control }) => {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Контактное лицо</Typography>

      <Controller
        control={control}
        name="personFio"
        render={({ field }) => (
          <TextField
            {...field}
            label="ФИО"
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
        name="personPhone"
        render={({ field }) => (
          <TextField
            {...field}
            label="Телефон"
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
          />
        )}
      />

      <Controller
        control={control}
        name="personIin"
        render={({ field }) => (
          <TextField
            {...field}
            label="ИИН"
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

export default EditContactPerson;
