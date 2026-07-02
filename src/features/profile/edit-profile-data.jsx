import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import UploadAvatar from "../../components/re-profile/upload-avatar";
import EditCompanyFileds from "../../components/re-profile/edit-company-fileds";
import EditBankDetails from "../../components/re-profile/edit-bank-details";
import EditContactPerson from "../../components/re-profile/edit-contact-person";
import EditPassword from "../../components/re-profile/edit-password";
import EditDocumentDetails from "../../components/re-profile/edit-document-details";
import { Box, Button } from "@mui/material";
import { useProfileStore } from "../../app/store/profile/profile-store";
import { mapProfileFormToChangedApi } from "../profile-edit/profile-form-helpers";

const EditProfileForm = ({ profileData }) => {
  const editProfileData = useProfileStore((state) => state.editProfileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const uploadAvatar = useProfileStore((state) => state.uploadAvatar);
  const deleteAvatar = useProfileStore((state) => state.deleteAvatar);

  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
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
      try {
        await deleteAvatar();
        setSelectedImg("");
        setPreview("");
      } catch (e) {
        console.log(e);
      }
    }

    getProfileData();
  };

  const onEditSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = mapProfileFormToChangedApi(data);

    if (!isDirty && !selectedImg) {
      setSubmitError("Нет изменений для сохранения");
      return;
    }

    await editProfileData(payload);

    if (selectedImg) {
      await uploadAvatar({
        file: selectedImg,
        name: selectedImg.name,
        context: "avatar",
      });
    }

    await getProfileData();
    setSelectedImg("");
    setPreview("");

    setIsSubmitting(false);
  };

  return (
    <>
      {submitError && <Alert severity="error">{submitError}</Alert>}

      <UploadAvatar
        formValues={formValues}
        selectedImg={selectedImg}
        preview={preview}
        handleFileChange={handleFileChange}
        handleClearAvatar={handleClearAvatar}
      />

      <EditCompanyFileds control={control} />

      <EditBankDetails control={control} />

      <EditContactPerson control={control} />

      <EditPassword control={control} />

      <EditDocumentDetails control={control} />

      <Box>
        <Button
          variant="contained"
          onClick={handleSubmit(onEditSubmit)}
          disabled={(!isDirty && !selectedImg) || isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </Button>
      </Box>
    </>
  );
};

export default EditProfileForm;
