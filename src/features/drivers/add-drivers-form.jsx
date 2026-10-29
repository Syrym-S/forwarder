import { useTranslation } from "react-i18next";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
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
  const { t } = useTranslation();
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
      registration_document_name: t("ui.state_registration_certificate"),
      employer_document_name: t("ui.appointment_order"),
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
          >{t("ui.adding_driver")}</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>{t("ui.fill_driver_details")}</Typography>
        </Box>
        <TooltipIconButton
          title={t("ui.close_form")}
          aria-label={t("ui.close_form")}
          onClick={onClose}
          disabled={isSubmitting}
        >
          <CloseRoundedIcon />
        </TooltipIconButton>
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
              >{t("ui.personal_details")}</Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >{t("ui.driver_contact_information")}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="fio"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={t("ui.full_name")} fullWidth size="small" />
                )}
              />
            </Grid>

            {!isForeigner && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="iin"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label={t("ui.iin")} fullWidth size="small" />
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
                    label={t("ui.phone_2")}
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
              >{t("ui.entrepreneur_and_bank_details")}</Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >{t("ui.entrepreneur_registration_required")}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("ui.entrepreneur_name")}
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
                    label={t("ui.company_bin")}
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
                    label={t("ui.registered_address")}
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
                  <TextField {...field} label={t("ui.bic")} fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="iik"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={t("ui.iban")} fullWidth size="small" />
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
              >{t("ui.identity_document")}</Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >{t("ui.identity_document_details_hint")}</Typography>
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
                      label={t("ui.foreign_national")}
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
                    label={t("ui.identity_document_number")}
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
                    label={t("ui.issuing_country")}
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
                        label={t("ui.document_issue_date_2")}
                        type="date"
                        disabled={isForeigner}
                        fullWidth
                        size="small"
                        helperText={t("ui.issue_date_not_in_future")}
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
                        label={t("ui.document_issued_by")}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { required: true } }}
                        error={Boolean(fieldState.error)}
                        helperText={
                          fieldState.error?.message || t("ui.select_issuing_authority")
                        }
                      >
                        <MenuItem value="МЮ РК">{t("ui.kazakhstan_ministry_of_justice")}</MenuItem>
                        <MenuItem value="МВД РК">{t("ui.kazakhstan_ministry_of_internal_affairs")}</MenuItem>
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
              >{t("ui.account_access")}</Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
              >{t("ui.password_requirements_hint")}</Typography>
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
                    required: t("ui.enter_password"),

                    validate: (value) => {
                      if (value.length < 6) {
                        return t("ui.password_minimum_length");
                      }

                      if (!/[A-Z]/.test(value)) {
                        return t("ui.password_uppercase_required");
                      }

                      if (!/[a-z]/.test(value)) {
                        return t("ui.password_lowercase_required");
                      }

                      if (!/\d/.test(value)) {
                        return t("ui.password_digit_required");
                      }

                      if (
                        !/[!@#$%^&*(),.?":{}|<>_\-+=\\/[\];'`~]/.test(value)
                      ) {
                        return t("ui.password_special_character_required");
                      }

                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type={showPassword ? "text" : "password"}
                      label={t("ui.password")}
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <TooltipIconButton
                                title={showPassword ? t("ui.hide_password") : t("ui.show_password")}
                                aria-label={showPassword ? t("ui.hide_password") : t("ui.show_password")}
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </TooltipIconButton>
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
                    required: t("ui.confirm_password_prompt"),
                    validate: (value) =>
                      value === formValues.password || t("ui.passwords_do_not_match"),
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      label={t("ui.password_confirmation")}
                      fullWidth
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <TooltipIconButton
                                title={showConfirmPassword ? t("ui.hide_password_confirmation") : t("ui.show_password_confirmation")}
                                aria-label={showConfirmPassword ? t("ui.hide_password_confirmation") : t("ui.show_password_confirmation")}
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
                              </TooltipIconButton>
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
                  >{t("ui.documents")}</Typography>
                  <Typography
                    sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
                  >{t("ui.required_document_upload")}</Typography>
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
                        >{t("ui.legal_entity_registration_document_required")}</Typography>

                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileIcon />}
                        >
                          {registrationDocumentsToUpload?.length
                            ? t("ui.replace_document")
                            : t("ui.choose_file")}
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
                        <TooltipIconButton
                          title={t("ui.delete_document")}
                          aria-label={t("ui.delete_document")}
                          color="error"
                          onClick={() => {
                            setRegistrationDocumentsToUpload(null);
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </TooltipIconButton>
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
                        >{t("ui.employee_employment_document_required")}</Typography>

                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileIcon />}
                        >
                          {employerDocumentToUpload?.length
                            ? t("ui.replace_document")
                            : t("ui.choose_file")}
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

                        <TooltipIconButton
                          title={t("ui.delete_document")}
                          aria-label={t("ui.delete_document")}
                          // disabled={isSubmitting}
                          color="error"
                          onClick={() => {
                            setValue("employer_document", null);
                            setEmployerDocumentToUpload(null);
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </TooltipIconButton>
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
          text={t("ui.cancel")}
        />
        <PrimaryButton
          type="submit"
          form="driver-form"
          isLoading={isSubmitting}
          text={isSubmitting ? t("ui.saving") : t("ui.add_driver")}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddDriverForm;
