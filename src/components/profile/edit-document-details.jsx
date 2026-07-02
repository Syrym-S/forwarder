import { Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const EditDocumentDetails = ({ control }) => {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Документ</Typography>

      <Controller
        control={control}
        name="personDocumentNumber"
        render={({ field }) => (
          <TextField
            {...field}
            label="Номер документа"
            type="number"
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
        name="personIssueCountry"
        render={({ field }) => (
          <TextField
            {...field}
            label="Страна"
            // value={form.personIssueCountry}
            // onChange={handleChange}
            // error={Boolean(errors.personIssueCountry)}
            // helperText={errors.personIssueCountry}
            sx={{
              textTransform: "uppercase",
            }}
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export default EditDocumentDetails;
