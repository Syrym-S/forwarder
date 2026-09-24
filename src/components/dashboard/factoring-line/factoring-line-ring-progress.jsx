import { Box, CircularProgress, Typography } from "@mui/material";
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
      role="link"
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === "Enter") handleNavigateToDetailPage(); }}
      sx={{
        width: {
          xs: "100%",
          md: "100%",
        },

        mx: "auto",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "0.2s ease",
        p: 2,
        boxSizing: "border-box",
        bgcolor: "background.default",
        minWidth: 0,
        "&:hover, &:focus-visible": {
          borderColor: "primary.main",
          boxShadow: "0 6px 18px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          pb: 1,
          mb: 1,
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, overflowWrap: "anywhere" }}> {factor.company_name}</Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>БИН: {factor.company_bin}</Typography>
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
            width: 140,
            height: 140,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={140}
            thickness={4}
            sx={{
              position: "absolute",
              opacity: 0.12,
              color: "rgba(0,0,0,0.5)",
            }}
          />

          <CircularProgress
            variant="determinate"
            value={usedPercent}
            size={140}
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
              flexWrap: "wrap",
            minWidth: 0,
            justifyContent: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
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
            gap: {
              xs: 2,
              md: 1.5,
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.7rem",
                  md: "0.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.3,
                mb: 0.25,
              }}
            >
              Максимальная сумма
            </Typography>

            <Typography
              sx={{
                color: "text.primary",
                fontSize: {
                  xs: "0.75rem",
                  md: "1rem",
                },
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {line.summ_max.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.7rem",
                  md: "0.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.3,
                mb: 0.25,
              }}
            >
              Потрачено
            </Typography>

            <Typography
              sx={{
                color: "text.primary",
                fontSize: {
                  xs: "0.75rem",
                  md: "1rem",
                },
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {line.summ_current.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.7rem",
                  md: "0.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.3,
                mb: 0.25,
              }}
            >
              Свободно
            </Typography>

            <Typography
              sx={{
                color: "text.primary",
                fontSize: {
                  xs: "0.75rem",
                  md: "1rem",
                },
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {line.summ_free.toLocaleString("ru-RU")} {line.currency}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.7rem",
                  md: "0.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.3,
                mb: 0.25,
              }}
            >
              Срок
            </Typography>

            <Typography
              sx={{
                color: "text.primary",
                fontSize: {
                  xs: "0.75rem",
                  md: "1rem",
                },
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {line.summ_free} {line.currency}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringLineRingProgress;
