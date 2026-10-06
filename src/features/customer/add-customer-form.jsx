import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import { IMaskInput } from "react-imask";
import PrimaryButton from "../../shared/ui/button/primary-button";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

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
  person_document_issue_date: "",
  person_document_issued_by: "",
};

const sectionSx = {
  p: { xs: 1.5, sm: 2.5 },
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2.5,
};

const sectionTitleSx = {
  mb: 2,
  pb: 1,
  borderBottom: "1px solid",
  borderColor: "divider",
  fontSize: 15,
  fontWeight: 600,
  color: "font_color.heading",
};

const AddCustomerForm = ({ open, handleClose }) => {
  const createCustomer = useCustomerStore((state) => state.createCustomer);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
  });

  const submitCustomerHandle = async (data) => {
    await createCustomer({
      ...data,
      person_phone: data.person_phone.replace(/\D/g, ""),
    });

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="customer-form-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            m: { xs: 1.5, sm: 4 },
            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
            maxHeight: "calc(100% - 32px)",
            "& .MuiButton-root": { textTransform: "none", borderRadius: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.paper",
            },
          },
        },
      }}
    >
      <DialogTitle component="div" sx={{ p: { xs: 2, sm: 3 }, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ p: 1.25, display: "flex", borderRadius: 2, bgcolor: "background.main", color: "primary.main" }}>
          <BusinessOutlinedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography id="customer-form-title" component="h2" sx={{ fontSize: 20, fontWeight: 600, color: "font_color.heading" }}>
            Приглашение заказчика
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Заполните данные компании и контактного лица
          </Typography>
        </Box>
        <TooltipIconButton title="Закрыть форму" aria-label="Закрыть форму" onClick={handleClose} disabled={isSubmitting}>
          <CloseRoundedIcon />
        </TooltipIconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.default" }}>
        <Stack component="form" id="customer-form" onSubmit={handleSubmit(submitCustomerHandle)} spacing={2.5}>
          <Box
            sx={{
              ...sectionSx,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Typography component="h3" sx={{ ...sectionTitleSx, gridColumn: "1 / -1", mb: 0 }}>
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

          <Box sx={sectionSx}>
            <Typography component="h3" sx={sectionTitleSx}>
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
                      slotProps={{
                        input: {
                          inputComponent: IMaskInput,
                          inputProps: {
                            mask: "+{7} (000) 000-00-00",
                            unmask: false,
                            onAccept: (value, mask) => {
                              field.onChange(mask.unmaskedValue);
                            },
                          },
                        },
                      }}
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="person_document_issue_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      label="Дата выдачи документа"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="person_document_issued_by"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Кем выдан документ"
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

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1 }}>
        <PrimaryButton variant="outlined" onClick={handleClose} text="Отмена" disabled={isSubmitting} />

        <PrimaryButton
          type="submit"
          form="customer-form"
          disabled={isSubmitting}
          text={isSubmitting ? "Создание…" : "Создать приглашение"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerForm;
