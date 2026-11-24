import AppBreadcrumbs from "./app-breadcrumbs";

import { useTranslation } from "react-i18next";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageRoutesStore } from "../../app/store/page-routes/use-page-routes-store";

const RootLayout = ({
  data = null,
  withoutDataCheck = false,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const setPath = usePageRoutesStore((state) => state.setPath);

  useEffect(() => {
    setPath(pathname.replace("/", ""));
  }, [pathname, setPath]);

  if ((!data && !withoutDataCheck) || data?.length === 0) {
    return (
      <Box
        sx={{
          padding: {
            xs: "5px",
            sm: "30px",
          },
          zIndex: 0,
          paddingLeft: {
            xs: "10vw",
            sm: "calc(20vw + 30px)",
          },
        }}
      >
        <Alert
          severity="info"
          sx={{
            height: "fit-content",
          }}
        >
          <AlertTitle>{t("ui.empty_exclamation")}</AlertTitle>
          <Typography color="text.secondary">
            {t("ui.data_temporarily_unavailable")}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: {
          xs: "10px",
          sm: "30px",
        },
        zIndex: 0,
        paddingLeft: {
          xs: "10px",
          sm: "calc(20vw + 30px)",
        },
      }}
      {...props}
    >
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <AppBreadcrumbs />
      </Box>
      {children}
    </Box>
  );
};

export default RootLayout;
