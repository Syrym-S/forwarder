import { Alert, AlertTitle, Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const RootLayout = ({
  data = null,
  isLoading,
  withoutDataCheck = false,
  children,
  ...props
}) => {
  const location = useLocation();

  if (!data && !withoutDataCheck) {
    return (
      <Box
        sx={{
          padding: "30px",
          zIndex: 0,
          paddingLeft: {
            sm: "22vw",
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
        border: "1px solid black",
        padding: "30px",
        zIndex: 0,
        paddingLeft: {
          sm: "22vw",
          md: "22vw",
        },
      }}
      {...props}
    >
      {/* <Typography
        sx={{
          fontSize: "15px",
          color: "#a3a1a1",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowBackIosIcon
          sx={{
            fontSize: "15px",
          }}
        />
        {location.pathname.replaceAll("/", "").toUpperCase()}
      </Typography> */}
      {children}
    </Box>
  );
};

export default RootLayout;
