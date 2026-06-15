import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useLeadsStore } from "../../app/store/leads-store";

const TenderForm = ({ openForm, handleCloseForm }) => {
  const { control } = useForm();
  const leads = useLeadsStore((state) => state.leads);
  const isLoading = useLeadsStore((state) => state.isLoading);

  if (isLoading) return <>...</>;

  return (
    <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
      <DialogTitle>Создание тендера</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Controller
          name="lead"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={leads || []}
              value={field.value || null}
              onChange={(_, value) => field.onChange(value)}
              getOptionLabel={(option) => option?.title || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Лид"
                  placeholder="Выбирите лида"
                />
              )}
              renderOption={(props, option) => {
                return (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography fontWeight={700}>{option.id}</Typography>
                  </Box>
                );
              }}
            />
          )}
        />
        <Controller
          name="public_date_time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              //   defaultValue={dayjs(form.loading_date).format("YYYY-MM-DD")}
              value={field.value}
              label="Дата публикации"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
                marginTop: "10px",
              }}
            />
          )}
        />
        <Controller
          name="end_date_time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              //   defaultValue={dayjs(form.loading_date).format("YYYY-MM-DD")}
              value={field.value}
              label="Дата окончания"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
                marginTop: "10px",
              }}
            />
          )}
        />
        <Controller
          name="publication_type"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Публичный тендер"
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
            />
          )}
        />

        <Controller
          name="max_participants"
          control={control}
          render={(filed) => <TextField type="number" />}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" color="error" onClick={handleCloseForm}>
            Отмена
          </Button>

          <Button variant="contained">Создать</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TenderForm;
