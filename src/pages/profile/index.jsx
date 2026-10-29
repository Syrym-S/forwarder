import { useTranslation } from "react-i18next";
import RootLayout from "../../components/layout/root-layout";
import EditProfileForm from "../../features/profile/edit-profile-data";
import DeleteAccountBlock from "../../components/profile/delete-account-block";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { useEffect } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useProfileStore } from "../../app/store/profile/profile-store";

const Profile = () => {
  const { t } = useTranslation();
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
            borderRadius: 5,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.5rem",
                }}
              >{t("ui.profile")}</Typography>

              <Typography color="text.secondary" fontSize={14}>{t("ui.company_and_contact_details")}</Typography>
            </Box>

            <EditProfileForm
              profileData={profileData}
              legalDocuments={legalDocuments}
            />
          </Stack>
        </Paper>
        <DeleteAccountBlock />
      </Container>
    </RootLayout>
  );
};

export default Profile;
