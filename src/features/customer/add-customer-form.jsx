import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useCustomerStore } from "../../app/store/customers/customers-store";

const ORGANIZATION_TYPES = [
  { label: "ТОО", value: "ТОО" },
  { label: "ИП", value: "ИП" },
];

const defaultValues = {
  full_name: "",
  type: "",
  bin: "",
  bik: "",
  legal_address: "",
  account_number: "",
  bank_name: "",
  person_fio: "",
  person_phone: "",
  person_iin: "",
  person_email: "",
};

const AddCustomerForm = ({ open, handleClose }) => {
  const createCustomer = useCustomerStore((state) => state.createCustomer);

  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  const submitCustomerHandle = async (data) => {
    await createCustomer(data);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавление заказчика</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Информация о компании
            </Typography>

            <Controller
              name="full_name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Название компании"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={ORGANIZATION_TYPES}
                  value={
                    ORGANIZATION_TYPES.find(
                      (option) => option.value === field.value,
                    ) || null
                  }
                  onChange={(_, value) => field.onChange(value?.value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Тип организации"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="bin"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="БИН"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="legal_address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Юридический адрес"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="bik"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="БИК"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="account_number"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  size="small"
                  {...field}
                  fullWidth
                  label="Расчетный счет"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="bank_name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  size="small"
                  {...field}
                  fullWidth
                  label="Банк"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Контактное лицо
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="person_fio"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      {...field}
                      fullWidth
                      label="ФИО"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="person_phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Номер телефона"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="person_email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Email"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="person_iin"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="ИИН"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Отмена</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(submitCustomerHandle)}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerForm;
