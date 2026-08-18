import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { renderLineColor } from "../../../shared/helpers/factoring/render-progress-line-color";

const FactoringLineRingProgress = ({ line }) => {
  const factor = line.factor;
  const usedPercent =
    line.summ_max > 0
      ? Math.round((line.summ_current / line.summ_max) * 100)
      : 0;

  const navigate = useNavigate();

  const handleNavigateToDetailPage = () => {
    navigate(
      `/factoring-lines/${line.id}/${factor.company_bin}-${factor.company_name}`,
    );
  };

  return (
    <Box
      onClick={handleNavigateToDetailPage}
      sx={{
        width: {
          xs: "100%",
          md: "70%",
        },
        mx: "auto",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "0.2s ease",
        p: 1,
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 6px 18px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          pb: 1,
          mb: 1,
          justifyContent: "space-around",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography>Компания: {factor.company_name}</Typography>
        <Typography>Бин: {factor.company_bin}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: {
            xs: "center",
            md: "space-around",
          },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 180,
            height: 180,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={180}
            thickness={4}
            sx={{
              position: "absolute",
              opacity: 0.12,
            }}
          />

          <CircularProgress
            variant="determinate"
            value={usedPercent}
            size={180}
            thickness={4}
            sx={{
              color: renderLineColor(usedPercent),
              position: "absolute",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {usedPercent}%
            </Typography>

            <Typography variant="body2" color="text.secondary">
              использовано
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "row",
              md: "column",
            },
            justifyContent: "center",
            alignItems: {
              xs: "end",
              md: "start",
            },
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Максимальная сумма
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: " 0.7rem",
                  md: "1rem",
                },
              }}
            >
              {line.summ_max.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Потрачено
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: " 0.7rem",
                  md: "1rem",
                },
              }}
            >
              {line.summ_current.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Свободно
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: " 0.7rem",
                  md: "1rem",
                },
              }}
            >
              {line.summ_free.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringLineRingProgress;
