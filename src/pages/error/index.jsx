import { useTranslation } from "react-i18next";
import { Box, Button, Stack, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import notFoundIllustration from "./assets/not-found-logistics.png";
import { useEffect } from "react";

const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const navigate = useNavigate();
  const isNotFound = error?.status === 404;
  useEffect(() => {
    document.title = isNotFound ? t("ui.page_not_found") : t("ui.error");
  }, [isNotFound, t]);

  let message =
    error?.message || t("ui.refresh_or_back_hint");

  if (isRouteErrorResponse(error)) {
    if (isNotFound) {
      message =
        t("ui.page_not_found_description");
    } else if (error.status >= 500) {
      message = t("ui.server_error_try_later");
    } else {
      message = error.statusText || message;
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 880,
          overflow: "hidden",
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 12px 40px rgba(22, 36, 62, 0.06)",
          textAlign: "center",
          px: { xs: 3, sm: 6, md: 8 },
          py: { xs: 4, sm: 5 },
        }}
      >
        {isNotFound ? (
          <Box
            component="img"
            src={notFoundIllustration}
            alt={t("ui.not_found_truck_alt")}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 660,
              mx: "auto",
              mb: { xs: 3, sm: 4 },
              mixBlendMode: "multiply",
            }}
          />
        ) : (
          <WarningAmberRoundedIcon
            sx={{
              display: "block",
              fontSize: 90,
              color: "primary.main",
              mx: "auto",
              mb: 4,
            }}
          />
        )}
        <Typography
          component="h1"
          sx={{
            color: "font_color.heading",
            fontWeight: 600,
            fontSize: { xs: 26, sm: 34 },
            lineHeight: 1.25,
            mb: 1.5,
          }}
        >
          {isNotFound ? t("ui.point_not_on_route") : t("ui.something_went_wrong")}
        </Typography>
        {isNotFound && (
          <Typography sx={{ color: "primary.main", fontSize: 13, mb: 2 }}>{t("ui.page_not_found_error_title")}</Typography>
        )}
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.7,
            maxWidth: 570,
            mx: "auto",
          }}
        >
          {message}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          spacing={1.5}
          sx={{ mt: 3.5 }}
        >
          <Button
            variant="contained"
            startIcon={
              isNotFound ? <HomeOutlinedIcon /> : <RefreshRoundedIcon />
            }
            onClick={() =>
              isNotFound ? navigate("/") : window.location.reload()
            }
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.3,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            {isNotFound ? t("ui.go_home") : t("ui.refresh_page")}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, px: 3, py: 1.3, textTransform: "none" }}
          >{t("ui.back")}</Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ErrorPage;
