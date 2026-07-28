import React, { useEffect } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import UploadAvatar from "../../components/profile/upload-avatar";
import EditCompanyFileds from "../../components/profile/edit-company-fileds";
import EditBankDetails from "../../components/profile/edit-bank-details";
import EditContactPerson from "../../components/profile/edit-contact-person";
import EditPassword from "../../components/profile/edit-password";
import EditDocumentDetails from "../../components/profile/edit-document-details";
import { useProfileStore } from "../../app/store/profile/profile-store";
import EditProfileForm from "../../features/profile/edit-profile-data";
import PageLoader from "../../shared/ui/loaders/page-loader";

const Profile = () => {
  const profileData = useProfileStore((state) => state.profileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const legalDocuments = useProfileStore((state) => state.legalDocuments);
  const getLegalDocuments = useProfileStore((state) => state.getLegalDocuments);

  useEffect(() => {
    getProfileData();
    getLegalDocuments();
  }, []);

  if (!profileData)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper
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

            <EditProfileForm
              profileData={profileData}
              legalDocuments={legalDocuments}
            />
          </Stack>
        </Paper>
      </Container>
    </RootLayout>
  );
};

export default Profile;
