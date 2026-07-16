import { Alert, AlertTitle, Box, Breadcrumbs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link, useLocation } from "react-router-dom";
import { usePageRoutesStore } from "../../app/store/page-routes/use-page-routes-store";
import AppBreadcrumbs from "./app-breadcrumbs";

const RootLayout = ({
  data = null,
  withoutDataCheck = false,
  children,
  ...props
}) => {
  const { pathname } = useLocation();

  const setPath = usePageRoutesStore((state) => state.setPath);

  useEffect(() => {
    setPath(pathname.replace("/", ""));
  }, [pathname, setPath]);

  if ((!data && !withoutDataCheck) || data?.length === 0) {
    return (
      <Box
        sx={{
          padding: "30px",
          zIndex: 0,
          paddingLeft: {
            xs: "10vw",
            md: "22vw",
          },
        }}
      >
        <Alert
          severity="info"
          sx={{
            height: "fit-content",
          }}
        >
          <AlertTitle>Пусто!</AlertTitle>
          <Typography color="text.secondary">
            Данные временно отсутствуют
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: "30px",
        zIndex: 0,
        paddingLeft: {
          sm: "22vw",
          md: "22vw",
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
