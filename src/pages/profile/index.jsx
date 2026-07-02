import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RootLayout from "../../components/layout/root-layout";
import {
  deleteAvatarApi,
  fetchForwarderProfile,
  updateForwarderProfile,
  uploadAvatarApi,
} from "../../features/profile-edit/profile-api";
import {
  initialProfileForm,
  mapProfileFormToChangedApi,
  mapProfileFromApi,
  validateProfileForm,
} from "../../features/profile-edit/profile-form-helpers";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { useProfileStore } from "../../app/store/profile/profile-store";

const ProfilePage = () => {
  const getProfileData = useProfileStore((state) => state.getProfileData);

  const [form, setForm] = useState(initialProfileForm);
  const [initialLoadedForm, setInitialLoadedForm] =
    useState(initialProfileForm);
  const [errors, setErrors] = useState({});

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);

  let isCancelled = false;

  async function loadProfile() {
    try {
      setIsProfileLoading(true);
      setProfileLoadError("");
      getProfileData();

      const profile = await fetchForwarderProfile();

      if (!isCancelled) {
        const mappedProfile = mapProfileFromApi(profile);

        setForm(mappedProfile);
        setInitialLoadedForm(mappedProfile);
        setErrors({});
        setSubmitError("");
        setSuccessMessage("");
      }
    } catch (error) {
      if (!isCancelled) {
        setProfileLoadError(
          error.response?.data?.message ||
            error.message ||
            "Не удалось загрузить профиль",
        );
      }
    } finally {
      if (!isCancelled) {
        setIsProfileLoading(false);
      }
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedImg(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleClearAvatar() {
    if (form.avatar) {
      try {
        setIsProfileLoading(true);
        await deleteAvatarApi();
        setSelectedImg("");
        setPreview("");
        setIsProfileLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    loadProfile();
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(event) {
    const { name, value } = event.target;

    const uppercasedValue =
      name === "personIssueCountry" ? value.toUpperCase() : value;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: uppercasedValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setSuccessMessage("");
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateProfileForm(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = mapProfileFormToChangedApi(form, initialLoadedForm);

    if (Object.keys(payload).length === 0 && !selectedImg) {
      setSubmitError("Нет изменений для сохранения");
      return;
    }

    try {
      setIsSaving(true);
      setSubmitError("");
      setSuccessMessage("");

      await updateForwarderProfile(payload);
      if (selectedImg) {
        await uploadAvatarApi({
          file: selectedImg,
          name: selectedImg.name,
          context: "avatar",
        });
      }

      const nextInitialForm = {
        ...form,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      };

      setInitialLoadedForm(nextInitialForm);
      setForm(nextInitialForm);
      setSuccessMessage("Профиль успешно обновлен");
      loadProfile();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Не удалось обновить профиль",
      );
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      try {
        setIsProfileLoading(true);
        setProfileLoadError("");

        const profile = await fetchForwarderProfile();

        if (!isCancelled) {
          const mappedProfile = mapProfileFromApi(profile);

          setForm(mappedProfile);
          setInitialLoadedForm(mappedProfile);
          setErrors({});
          setSubmitError("");
          setSuccessMessage("");
        }
      } catch (error) {
        if (!isCancelled) {
          setProfileLoadError(
            error.response?.data?.message ||
              error.message ||
              "Не удалось загрузить профиль",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <RootLayout withoutDataCheck>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: 3,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Профиль
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Данные компании и контактного лица
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <IconButton>
                {isProfileLoading ? (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "100%",
                      border: "5px solid",
                      borderColor: "primary.main",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : !selectedImg && !form?.avatar ? (
                  <AccountCircleIcon
                    color="primary"
                    sx={{
                      fontSize: "7rem",
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    sx={{
                      display: "block",
                      borderRadius: "100%",
                      width: "100px",
                      height: "100px",
                      border: 0,
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                    }}
                    src={form?.avatar || preview}
                  />
                )}
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography>Фото профиля</Typography>
                <Typography>
                  PNG или JPEG, размер от 400x400 до 600x600 px
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      minHeight: 40,
                      width: {
                        xs: "100%",
                        md: "auto",
                      },
                    }}
                  >
                    Загрузить фото
                    <input
                      name="file"
                      type="file"
                      hidden
                      accept=".jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {(selectedImg || form.avatar) && (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleClearAvatar}
                    >
                      Удалить
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {profileLoadError && (
              <Alert severity="error">{profileLoadError}</Alert>
            )}

            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Stack spacing={2}>
              <Typography fontWeight={600}>Компания</Typography>

              <TextField
                name="companyName"
                label="Название компании"
                value={form.companyName}
                onChange={handleChange}
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
                fullWidth
              />

              <TextField
                name="companyBin"
                label="БИН"
                value={form.companyBin}
                onChange={handleChange}
                error={Boolean(errors.companyBin)}
                helperText={errors.companyBin}
                fullWidth
              />

              <TextField
                name="companyAddress"
                label="Юридический адрес"
                value={form.companyAddress}
                onChange={handleChange}
                error={Boolean(errors.companyAddress)}
                helperText={errors.companyAddress}
                fullWidth
              />
            </Stack>

            <Stack spacing={2}>
              <Typography fontWeight={600}>Банковские реквизиты</Typography>

              <TextField
                name="companyAccount"
                label="Расчетный счет"
                value={form.companyAccount}
                onChange={handleChange}
                error={Boolean(errors.companyAccount)}
                helperText={errors.companyAccount}
                fullWidth
              />

              <TextField
                name="companyBik"
                label="БИК"
                value={form.companyBik}
                onChange={handleChange}
                error={Boolean(errors.companyBik)}
                helperText={errors.companyBik}
                fullWidth
              />
            </Stack>

            <Stack spacing={2}>
              <Typography fontWeight={600}>Контактное лицо</Typography>

              <TextField
                name="personFio"
                label="ФИО"
                value={form.personFio}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                name="personPhone"
                label="Телефон"
                value={form.personPhone}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                name="personEmail"
                label="Email"
                value={form.personEmail}
                onChange={handleChange}
                error={Boolean(errors.personEmail)}
                helperText={errors.personEmail}
                fullWidth
              />

              <TextField
                name="personIin"
                label="ИИН"
                value={form.personIin}
                onChange={handleChange}
                error={Boolean(errors.personIin)}
                helperText={errors.personIin}
                fullWidth
              />
            </Stack>

            <Stack spacing={2}>
              <Typography fontWeight={600}>Смена пароля</Typography>

              <TextField
                name="currentPassword"
                label="Текущий пароль"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                error={Boolean(errors.currentPassword)}
                helperText={errors.currentPassword}
                fullWidth
                autoComplete="off"
              />

              <TextField
                name="newPassword"
                label="Новый пароль"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                fullWidth
                autoComplete="new-password"
              />

              <TextField
                name="newPasswordConfirm"
                label="Повторите новый пароль"
                type="password"
                value={form.newPasswordConfirm}
                onChange={handleChange}
                error={Boolean(errors.newPasswordConfirm)}
                helperText={errors.newPasswordConfirm}
                fullWidth
                autoComplete="new-password"
              />
            </Stack>

            <Stack spacing={2}>
              <TextField
                name="personDocumentNumber"
                label="Номер документа"
                type="number"
                value={form.personDocumentNumber}
                onChange={handleChange}
                error={Boolean(errors.documentNumber)}
                helperText={errors.documentNumber}
                fullWidth
                //  autoComplete="new-password"
              />

              <TextField
                name="personIssueCountry"
                label="Страна"
                value={form.personIssueCountry}
                onChange={handleChange}
                error={Boolean(errors.personIssueCountry)}
                helperText={errors.personIssueCountry}
                sx={{
                  textTransform: "uppercase",
                }}
                fullWidth
                //  autoComplete="new-password"
              />
            </Stack>

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving || isProfileLoading}
              >
                {isSaving
                  ? "Сохранение..."
                  : isProfileLoading
                    ? "Загрузка..."
                    : "Сохранить"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </RootLayout>
  );
};

export default ProfilePage;
