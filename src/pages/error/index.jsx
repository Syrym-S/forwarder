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

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const isNotFound = error?.status === 404;
  let message =
    error?.message || "Попробуйте обновить страницу или вернуться назад.";

  if (isRouteErrorResponse(error)) {
    if (isNotFound) {
      message =
        "Похоже, вы свернули с маршрута. Страница перемещена или ссылка устарела. Вернитесь на главную, чтобы продолжить работу с перевозками.";
    } else if (error.status >= 500) {
      message = "Произошла ошибка на сервере. Попробуйте позже.";
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
            alt="404 — грузовик на маршруте"
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
          {isNotFound ? "Этой точки нет на маршруте" : "Что-то пошло не так"}
        </Typography>
        {isNotFound && (
          <Typography sx={{ color: "primary.main", fontSize: 13, mb: 2 }}>
            Ошибка 404 · Страница не найдена
          </Typography>
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
            {isNotFound ? "На главную" : "Обновить страницу"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, px: 3, py: 1.3, textTransform: "none" }}
          >
            Назад
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ErrorPage;
