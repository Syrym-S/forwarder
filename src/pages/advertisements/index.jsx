import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import RootLayout from "../../components/layout/root-layout";
import MainContainer from "../../components/advertisements/main-container";

const Advertisements = () => {
  const { t } = useTranslation();

  return (
    <RootLayout withoutDataCheck>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            color: "font_color.heading",
          }}
        >
          {t("advertisements.heading")}
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {t("advertisements.description")}
        </Typography>
      </Box>

      <MainContainer />
    </RootLayout>
  );
};

export default Advertisements;
