import { useEffect, useState } from 'react';

import {
   Alert,
   Box,
   Button,
   Container,
   Paper,
   Stack,
   TextField,
   Typography,
} from '@mui/material';

import RootLayout from '../../components/layout/root-layout';
import {
   fetchForwarderProfile,
   updateForwarderProfile,
} from '../../features/profile-edit/profile-api';
import {
   initialProfileForm,
   mapProfileFormToChangedApi,
   mapProfileFromApi,
   validateProfileForm,
} from '../../features/profile-edit/profile-form-helpers';

const ProfilePage = () => {
   const [form, setForm] = useState(initialProfileForm);
   const [initialLoadedForm, setInitialLoadedForm] =
      useState(initialProfileForm);
   const [errors, setErrors] = useState({});

   const [isProfileLoading, setIsProfileLoading] = useState(false);
   const [profileLoadError, setProfileLoadError] = useState('');

   const [isSaving, setIsSaving] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');
   const [submitError, setSubmitError] = useState('');

   function handleChange(event) {
      const { name, value } = event.target;

      setForm((prevForm) => ({
         ...prevForm,
         [name]: value,
      }));

      setErrors((prevErrors) => ({
         ...prevErrors,
         [name]: '',
      }));

      setSuccessMessage('');
      setSubmitError('');
   }

   async function handleSubmit(event) {
      event.preventDefault();

      const nextErrors = validateProfileForm(form);

      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
         return;
      }

      const payload = mapProfileFormToChangedApi(form, initialLoadedForm);

      if (Object.keys(payload).length === 0) {
         setSubmitError('Нет изменений для сохранения');
         return;
      }

      try {
         setIsSaving(true);
         setSubmitError('');
         setSuccessMessage('');

         await updateForwarderProfile(payload);

         const nextInitialForm = {
            ...form,
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
         };

         setInitialLoadedForm(nextInitialForm);
         setForm(nextInitialForm);
         setSuccessMessage('Профиль успешно обновлен');
      } catch (error) {
         setSubmitError(
            error.response?.data?.message ||
               error.message ||
               'Не удалось обновить профиль',
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
            setProfileLoadError('');

            const profile = await fetchForwarderProfile();

            if (!isCancelled) {
               const mappedProfile = mapProfileFromApi(profile);

               setForm(mappedProfile);
               setInitialLoadedForm(mappedProfile);
               setErrors({});
               setSubmitError('');
               setSuccessMessage('');
            }
         } catch (error) {
            if (!isCancelled) {
               setProfileLoadError(
                  error.response?.data?.message ||
                     error.message ||
                     'Не удалось загрузить профиль',
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
         <Container maxWidth='md' sx={{ py: 3 }}>
            <Paper
               component='form'
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
                     <Typography variant='h6' fontWeight={600}>
                        Профиль
                     </Typography>

                     <Typography color='text.secondary' fontSize={14}>
                        Данные компании и контактного лица
                     </Typography>
                  </Box>

                  {profileLoadError && (
                     <Alert severity='error'>{profileLoadError}</Alert>
                  )}

                  {successMessage && (
                     <Alert severity='success'>{successMessage}</Alert>
                  )}

                  {submitError && <Alert severity='error'>{submitError}</Alert>}

                  <Stack spacing={2}>
                     <Typography fontWeight={600}>Компания</Typography>

                     <TextField
                        name='companyName'
                        label='Название компании'
                        value={form.companyName}
                        onChange={handleChange}
                        error={Boolean(errors.companyName)}
                        helperText={errors.companyName}
                        fullWidth
                     />

                     <TextField
                        name='companyBin'
                        label='БИН'
                        value={form.companyBin}
                        onChange={handleChange}
                        error={Boolean(errors.companyBin)}
                        helperText={errors.companyBin}
                        fullWidth
                     />

                     <TextField
                        name='companyAddress'
                        label='Юридический адрес'
                        value={form.companyAddress}
                        onChange={handleChange}
                        error={Boolean(errors.companyAddress)}
                        helperText={errors.companyAddress}
                        fullWidth
                     />
                  </Stack>

                  <Stack spacing={2}>
                     <Typography fontWeight={600}>
                        Банковские реквизиты
                     </Typography>

                     <TextField
                        name='companyAccount'
                        label='Расчетный счет'
                        value={form.companyAccount}
                        onChange={handleChange}
                        error={Boolean(errors.companyAccount)}
                        helperText={errors.companyAccount}
                        fullWidth
                     />

                     <TextField
                        name='companyBik'
                        label='БИК'
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
                        name='personFio'
                        label='ФИО'
                        value={form.personFio}
                        onChange={handleChange}
                        fullWidth
                     />

                     <TextField
                        name='personPhone'
                        label='Телефон'
                        value={form.personPhone}
                        onChange={handleChange}
                        fullWidth
                     />

                     <TextField
                        name='personEmail'
                        label='Email'
                        value={form.personEmail}
                        onChange={handleChange}
                        error={Boolean(errors.personEmail)}
                        helperText={errors.personEmail}
                        fullWidth
                     />

                     <TextField
                        name='personIin'
                        label='ИИН'
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
                        name='currentPassword'
                        label='Текущий пароль'
                        type='password'
                        value={form.currentPassword}
                        onChange={handleChange}
                        error={Boolean(errors.currentPassword)}
                        helperText={errors.currentPassword}
                        fullWidth
                        autoComplete='off'
                     />

                     <TextField
                        name='newPassword'
                        label='Новый пароль'
                        type='password'
                        value={form.newPassword}
                        onChange={handleChange}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword}
                        fullWidth
                        autoComplete='new-password'
                     />

                     <TextField
                        name='newPasswordConfirm'
                        label='Повторите новый пароль'
                        type='password'
                        value={form.newPasswordConfirm}
                        onChange={handleChange}
                        error={Boolean(errors.newPasswordConfirm)}
                        helperText={errors.newPasswordConfirm}
                        fullWidth
                        autoComplete='new-password'
                     />
                  </Stack>

                  <Box>
                     <Button
                        type='submit'
                        variant='contained'
                        disabled={isSaving || isProfileLoading}
                     >
                        {isSaving
                           ? 'Сохранение...'
                           : isProfileLoading
                             ? 'Загрузка...'
                             : 'Сохранить'}
                     </Button>
                  </Box>
               </Stack>
            </Paper>
         </Container>
      </RootLayout>
   );
};

export default ProfilePage;
