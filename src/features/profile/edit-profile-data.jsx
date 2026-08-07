import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import UploadAvatar from "../../components/profile/upload-avatar";
import EditCompanyFileds from "../../components/profile/edit-company-fileds";
import EditBankDetails from "../../components/profile/edit-bank-details";
import EditContactPerson from "../../components/profile/edit-contact-person";
import EditPassword from "../../components/profile/edit-password";
import EditDocumentDetails from "../../components/profile/edit-document-details";
import { Box, Button, CircularProgress } from "@mui/material";
import { useProfileStore } from "../../app/store/profile/profile-store";
import { mapProfileFormToChangedApi } from "../profile-edit/profile-form-helpers";
import RenderErroMessage from "../../shared/ui/render-error-message";
import RenderErrorContext from "../../shared/ui/errors/render-error-context";

const EditProfileForm = ({ profileData, legalDocuments }) => {
  const [registrationDocumentsToUpload, setRegistrationDocumentsToUpload] =
    useState(null);
  const [employerDocumentToUpload, setEmployerDocumentToUpload] =
    useState(null);
  const uploadAvatarError = useProfileStore((state) => state.uploadAvatarError);
  const uploadLegalDocuments = useProfileStore(
    (state) => state.uploadLegalDocuments,
  );

  const editProfileData = useProfileStore((state) => state.editProfileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const getLegalDocuments = useProfileStore((state) => state.getLegalDocuments);
  const uploadAvatar = useProfileStore((state) => state.uploadAvatar);
  const deleteAvatar = useProfileStore((state) => state.deleteAvatar);

  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    values: profileData,
  });

  const formValues = useWatch({ control });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClearAvatar = async () => {
    if (formValues.avatar) {
      await deleteAvatar();
      setSelectedImg(null);
      setPreview(null);
      getProfileData();
    } else {
      setSelectedImg(null);
      setPreview(null);
    }
  };

  const onEditSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = mapProfileFormToChangedApi(data, profileData);

      const isProfileChanged = Object.keys(payload).length > 0;

      if (isProfileChanged) {
        await editProfileData(payload);
      }

      if (registrationDocumentsToUpload || employerDocumentToUpload) {
        await uploadLegalDocuments(
          registrationDocumentsToUpload,
          employerDocumentToUpload,
        );
      }

      if (selectedImg) {
        await uploadAvatar({
          file: selectedImg,
          name: selectedImg.name,
          context: "avatar",
        });
      }

      await getProfileData();
      await getLegalDocuments();

      setSelectedImg(null);
      setPreview(null);

      setValue("registration_document", null);
      setValue("employer_document", null);

      setRegistrationDocumentsToUpload(null);
      setEmployerDocumentToUpload(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <UploadAvatar
        formValues={formValues}
        selectedImg={selectedImg}
        preview={preview}
        handleFileChange={handleFileChange}
        handleClearAvatar={handleClearAvatar}
      />

      {uploadAvatarError && <RenderErrorContext error={uploadAvatarError} />}

      <EditCompanyFileds control={control} />

      <EditBankDetails control={control} />

      <EditContactPerson control={control} />

      <EditPassword control={control} />

      <EditDocumentDetails
        setValue={setValue}
        isSubmitting={isSubmitting}
        legalDocuments={legalDocuments}
        registrationDocumentsToUpload={registrationDocumentsToUpload}
        employerDocumentToUpload={employerDocumentToUpload}
        setRegistrationDocumentsToUpload={setRegistrationDocumentsToUpload}
        setEmployerDocumentToUpload={setEmployerDocumentToUpload}
        control={control}
      />

      <Box>
        <Button
          variant="contained"
          color={uploadAvatarError ? "error" : "primary"}
          onClick={handleSubmit(onEditSubmit)}
          disabled={
            (!isDirty &&
              !selectedImg &&
              !registrationDocumentsToUpload &&
              !employerDocumentToUpload) ||
            isSubmitting
          }
        >
          {isSubmitting && <CircularProgress size={16} />}
          {isSubmitting && !uploadAvatarError
            ? "Сохранение..."
            : uploadAvatarError
              ? "Попробовать еще раз"
              : "Сохранить"}
        </Button>
      </Box>
    </>
  );
};

export default EditProfileForm;
