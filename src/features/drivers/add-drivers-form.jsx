import { Controller, useForm, useWatch } from "react-hook-form";
import { IMaskInput } from "react-imask";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { prepareDriverData } from "../../shared/helpers/prepare-driver-data";
import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const defaultValues = {
  fio: "",
  iin: "",
  phone: "",
  email: "",
  is_foreigner: false,
  company_name: "",
  company_bin: "",
  legal_address: "",
  bik: "",
  iik: "",
  document_number: "",
  issue_country: "",
  document_issue_date: "",
  password: "",
};

const AddDriverForm = ({ open, onClose, setSavedData }) => {
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const createDriver = useDriverStore((state) => state.createDriver);
  const error = useDriverStore((state) => state.error);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationDocumentsToUpload, setRegistrationDocumentsToUpload] =
    useState(null);
  const [employerDocumentToUpload, setEmployerDocumentToUpload] =
    useState(null);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
  });

  const formValues = useWatch({ control });
  const isForeigner = formValues.is_foreigner;

  const submitDriverCreate = async (data) => {
    const preparedData = prepareDriverData({
      ...data,
      registration_document_name: "Свидетельство о госрегистрации",
      employer_document_name: "Приказ о назначении",
    });

    const formData = new FormData();

    Object.entries(preparedData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (registrationDocumentsToUpload) {
      formData.append(
        "registration_document",
        registrationDocumentsToUpload[0],
      );
    }

    if (employerDocumentToUpload) {
      formData.append("employer_document", employerDocumentToUpload[0]);
    }

    try {
      await createDriver(formData);
      await getDrivers();

      setSavedData({
        email: data.email,
        password: data.password,
      });

      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Данные водителя</DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="driver-form"
          onSubmit={handleSubmit(submitDriverCreate)}
          sx={{ mt: 1 }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                my: 2,
              }}
            >
              {error}
            </Alert>
          )}
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
                    slotProps={{
                      input: {
                        inputComponent: IMaskInput,
                        inputProps: {
                          mask: "+{7} (000) 000-00-00",
                          unmask: false,
                        },
                      },
                    }}
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
                    disabled={isForeigner}
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
                  <TextField
                    {...field}
                    label="Страна"
                    fullWidth
                    size="small"
                    disabled={isForeigner}
                  />
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
                    disabled={isForeigner}
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

            <Grid
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: "1fr",
              }}
              size={6}
            >
              <Grid>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Введите пароль",

                    validate: (value) => {
                      if (value.length < 6) {
                        return "Пароль должен содержать минимум 6 символов";
                      }

                      if (!/[A-Z]/.test(value)) {
                        return "Пароль должен содержать хотя бы одну заглавную букву";
                      }

                      if (!/[a-z]/.test(value)) {
                        return "Пароль должен содержать хотя бы одну строчную букву";
                      }

                      if (!/\d/.test(value)) {
                        return "Пароль должен содержать хотя бы одну цифру";
                      }

                      if (
                        !/[!@#$%^&*(),.?":{}|<>_\-+=\\/[\];'`~]/.test(value)
                      ) {
                        return "Пароль должен содержать хотя бы один специальный символ";
                      }

                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type={showPassword ? "text" : "password"}
                      label="Пароль"
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: "Подтвердите пароль",
                    validate: (value) =>
                      value === formValues.password || "Пароли не совпадают",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      label="Подтверждение пароля"
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword((prev) => !prev)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid size={12}>
              <Box display="flex" gap={3}>
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

            <Box
              sx={{
                width: "100%",
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
              }}
            >
              <Box
                sx={{
                  border: "1px solid",
                  my: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  transition: "0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "1rem",
                        lineHeight: 1.4375,
                        letterSpacing: "0.00938em",
                        fontWeight: 400,
                      }}
                    >
                      Документ о регистрации юридического лица
                    </Typography>

                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                    >
                      Заменить документ
                      <input
                        hidden
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          setRegistrationDocumentsToUpload(event.target.files);
                        }}
                      />
                    </Button>
                  </Stack>
                </Box>

                {registrationDocumentsToUpload && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    {registrationDocumentsToUpload[0]?.type?.startsWith(
                      "image/",
                    ) ? (
                      <Box
                        component="img"
                        src={URL.createObjectURL(
                          registrationDocumentsToUpload[0],
                        )}
                        alt={registrationDocumentsToUpload[0].name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          backgroundColor: "action.hover",
                        }}
                      >
                        <InsertDriveFileOutlinedIcon
                          color="primary"
                          fontSize="large"
                        />
                      </Box>
                    )}
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        title={registrationDocumentsToUpload[0].name}
                      >
                        {registrationDocumentsToUpload[0].name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {(
                          registrationDocumentsToUpload[0].size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setRegistrationDocumentsToUpload(null);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Box>
                )}

                {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
              </Box>

              <Box
                sx={{
                  border: "1px solid",
                  my: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  transition: "0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack>
                    <Typography
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "1rem",
                        lineHeight: 1.4375,
                        letterSpacing: "0.00938em",
                        fontWeight: 400,
                      }}
                    >
                      Документ о трудоустройстве сотрудника
                    </Typography>

                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                    >
                      Заменить документ
                      <input
                        hidden
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          console.log("event", event.target.files);
                          setEmployerDocumentToUpload(event.target.files);
                        }}
                      />
                    </Button>
                  </Stack>
                </Box>

                {employerDocumentToUpload && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    {employerDocumentToUpload[0].type.startsWith("image/") ? (
                      <Box
                        component="img"
                        src={URL.createObjectURL(employerDocumentToUpload[0])}
                        alt={employerDocumentToUpload[0].name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          backgroundColor: "action.hover",
                        }}
                      >
                        <InsertDriveFileOutlinedIcon
                          color="primary"
                          fontSize="large"
                        />
                      </Box>
                    )}

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        title={employerDocumentToUpload[0].name}
                      >
                        {employerDocumentToUpload[0].name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {(
                          employerDocumentToUpload[0].size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </Typography>
                    </Box>

                    <IconButton
                      // disabled={isSubmitting}
                      color="error"
                      onClick={() => {
                        setValue("employer_document", null);
                        setEmployerDocumentToUpload(null);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Box>
                )}

                {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
              </Box>
            </Box>
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
