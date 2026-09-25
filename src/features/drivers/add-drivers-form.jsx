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
  MenuItem,
} from "@mui/material";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { prepareDriverData } from "../../shared/helpers/prepare-driver-data";
import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PrimaryButton from "../../shared/ui/button/primary-button";

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
  issue_country: "KZ",
  document_issue_date: "",
  document_issued_by: "",
  password: "",
  confirm_password: "",
};

const AddDriverForm = ({ open, onClose, setSavedData }) => {
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const createDriver = useDriverStore((state) => state.createDriver);
  const error = useDriverStore((state) => state.error);

  const hasToAddRegistrationDocuments =
    window.APP_DATA.features.registration_documents;

  const today = new Date();
  const maxIssueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationDocumentsToUpload, setRegistrationDocumentsToUpload] =
    useState(null);
  const [employerDocumentToUpload, setEmployerDocumentToUpload] =
    useState(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
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
      const response = await createDriver(formData);
      const credentials = response.data.credentials;

      console.log(response);
      await getDrivers();

      setSavedData({
        email: credentials.login,
        password: credentials.password,
        android_invite_link: credentials.login_url_android,
        ios_invite_link: credentials.login_url_ios,
      });

      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      aria-labelledby="driver-form-title"
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
      <DialogTitle
        component="div"
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1.25,
            display: "flex",
            borderRadius: 2,
            bgcolor: "background.main",
            color: "primary.main",
          }}
        >
          <PersonOutlineRoundedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            id="driver-form-title"
            component="h2"
            sx={{ fontSize: 20, fontWeight: 600, color: "font_color.heading" }}
          >
            Добавление водителя
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Заполните данные водителя, реквизиты и документы
          </Typography>
        </Box>
        <IconButton
          aria-label="Закрыть форму"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.default" }}
      >
        <Box
          component="form"
          id="driver-form"
          onSubmit={handleSubmit(submitDriverCreate)}
          sx={{
            "& > .MuiGrid-container": {
              p: { xs: 1.5, sm: 2.5 },
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
            },
          }}
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
            <Grid
              size={12}
              sx={{
                mt: 1,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "font_color.heading",
                }}
              >
                Личные данные
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >
                Контактная информация водителя
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="fio"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ФИО" fullWidth size="small" />
                )}
              />
            </Grid>

            {!isForeigner && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="iin"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="ИИН" fullWidth size="small" />
                  )}
                />
              </Grid>
            )}

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

            <Grid
              size={12}
              sx={{
                mt: 1,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "font_color.heading",
                }}
              >
                ИП и реквизиты
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >
                Регистрация ИП обязательна. Укажите данные ИП и банковского
                счёта
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название ИП"
                    slotProps={{ inputLabel: { required: true } }}
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

            <Grid
              size={12}
              sx={{
                mt: 1,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "font_color.heading",
                }}
              >
                Удостоверяющий документ
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >
                Номер, страна и дата выдачи документа
              </Typography>
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
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.onChange(checked);
                            if (!checked) {
                              setValue("issue_country", "KZ", {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                          }}
                        />
                      }
                      label="Иностранец"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="document_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Номер документа удостоверения личности / паспорта"
                    slotProps={{ inputLabel: { required: true, shrink: true } }}
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
                    label={"Страна выдачи"}
                    slotProps={{ inputLabel: { required: true } }}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            {!isForeigner && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="document_issue_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Когда выдан документ"
                        type="date"
                        disabled={isForeigner}
                        fullWidth
                        size="small"
                        helperText="Дата выдачи не позднее сегодняшнего дня"
                        slotProps={{
                          htmlInput: { max: maxIssueDate },
                          inputLabel: {
                            shrink: true,
                            required: true,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="document_issued_by"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Кем выдан документ"
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { required: true } }}
                        error={Boolean(fieldState.error)}
                        helperText={
                          fieldState.error?.message || "Выберите орган выдачи"
                        }
                      >
                        <MenuItem value="МЮ РК">МЮ РК</MenuItem>
                        <MenuItem value="МВД РК">МВД РК</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid
              size={12}
              sx={{
                mt: 1,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "font_color.heading",
                }}
              >
                Доступ к аккаунту
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >
                Минимум 6 символов: заглавная и строчная буквы, цифра и
                специальный символ
              </Typography>
            </Grid>

            <Grid
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
              }}
              size={12}
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

            {hasToAddRegistrationDocuments && (
              <>
                <Grid
                  size={12}
                  sx={{
                    mt: 1,
                    pb: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "font_color.heading",
                    }}
                  >
                    Документы
                  </Typography>
                  <Typography
                    sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
                  >
                    Загрузка документов обязательна
                  </Typography>
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
                      minWidth: 0,
                      bgcolor: "background.default",
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
                      <Stack spacing={1.5}>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontSize: 14,
                            lineHeight: 1.4375,
                            letterSpacing: "0.00938em",
                            fontWeight: 500,
                          }}
                        >
                          Документ о регистрации юридического лица *
                        </Typography>

                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileIcon />}
                        >
                          {registrationDocumentsToUpload?.length
                            ? "Заменить документ"
                            : "Выбрать файл"}
                          <input
                            hidden
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => {
                              setRegistrationDocumentsToUpload(
                                event.target.files,
                              );
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
                      minWidth: 0,
                      bgcolor: "background.default",
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
                      <Stack spacing={1.5}>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontSize: 14,
                            lineHeight: 1.4375,
                            letterSpacing: "0.00938em",
                            fontWeight: 500,
                          }}
                        >
                          Документ о трудоустройстве сотрудника *
                        </Typography>

                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileIcon />}
                        >
                          {employerDocumentToUpload?.length
                            ? "Заменить документ"
                            : "Выбрать файл"}
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
                        {employerDocumentToUpload[0].type.startsWith(
                          "image/",
                        ) ? (
                          <Box
                            component="img"
                            src={URL.createObjectURL(
                              employerDocumentToUpload[0],
                            )}
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
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          gap: 1,
          "& > .MuiButton-root": { flex: { xs: 1, sm: "initial" } },
        }}
      >
        <PrimaryButton
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          text="Отмена"
        />
        <PrimaryButton
          type="submit"
          form="driver-form"
          isLoading={isSubmitting}
          text={isSubmitting ? "Сохранение…" : "Добавить водителя"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddDriverForm;
