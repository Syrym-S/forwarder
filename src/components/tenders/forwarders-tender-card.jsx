import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RenderStatus from "../../shared/ui/render-status";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InfoItem from "../../shared/ui/info-item";

const ForwardersTenderCard = ({ tender }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/tenders-driver/${tender.id}`);
  };

  return (
    <Box
      onClick={navigateToDetailPage}
      tabIndex={0}
      sx={{
        maxWidth: "700px",
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Аукцион
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.3,
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                },
                fontWeight: 500,
              }}
            >
              Аукцион #{tender.id || "—"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
            }}
          >
            <RenderStatus status={tender.status} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TripOriginIcon sx={{ fontSize: 12, color: "primary.main" }} />
              <Typography
                sx={{
                  fontSize: 12,
                }}
              >
                Откуда
              </Typography>
            </Box>

            <Typography
              fontWeight={500}
              sx={{
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              {tender?.lead?.from_location?.address ||
                tender?.lead?.from ||
                "Битые данные"}
            </Typography>
          </Box>

          <ArrowDownwardRoundedIcon
            sx={{
              color: "text.secondary",
              fontSize: 17,
              transform: {
                xs: "none",
                sm: "rotate(-90deg)",
              },
            }}
          />

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnOutlinedIcon
                sx={{ fontSize: 12, color: "primary.main" }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                }}
              >
                Куда
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              {tender?.lead?.to_location?.address ||
                tender?.lead?.from ||
                "Битые данные"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 1,
          }}
        >
          <InfoItem label="Дата публикации" value={tender?.public_date_time} />
          <InfoItem label="Дата закрытия" value={tender?.end_date_time} />
          <InfoItem label="Кол-во участников" value={tender?.bets_count} />
        </Box>
      </Stack>
    </Box>
  );
};

export default ForwardersTenderCard;
