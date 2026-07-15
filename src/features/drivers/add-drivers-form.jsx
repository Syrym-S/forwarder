import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useDriverStore } from "../../app/store/drivers/driver-store";

const defaultValues = {
  fio: "",
  iin: "",
  phone: "",
  email: "",
  is_ip: false,
  is_foreigner: false,
  company_name: "",
  company_bin: "",
  legal_address: "",
  bik: "",
  iik: "",
  document_number: "",
  issue_country: "",
  document_issue_date: "",
};

const AddDriverForm = ({ open, onClose }) => {
  const createDriver = useDriverStore((state) => state.createDriver);
  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  const submitDriverCreate = async (data) => {
    await createDriver(data);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Данные водителя</DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="driver-form"
          onSubmit={handleSubmit(submitDriverCreate)}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="fio"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ФИО" fullWidth size="small" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="iin"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ИИН" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Телефон"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название компании"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="company_bin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="БИН компании"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="legal_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Юридический адрес"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="bik"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="БИК" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="iik"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ИИК" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="document_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Номер документа"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="issue_country"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Страна" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="document_issue_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дата выдачи"
                    type="date"
                    fullWidth
                    size="small"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Box display="flex" gap={3}>
                <Controller
                  name="is_ip"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="ИП"
                    />
                  )}
                />

                <Controller
                  name="is_foreigner"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Иностранец"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" form="driver-form" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDriverForm;
