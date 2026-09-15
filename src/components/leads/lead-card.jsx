import { Typography, Box, Stack } from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";
import RenderStatus from "../../shared/ui/render-status";
import InfoField from "../../shared/ui/info-field";

const LeadCard = ({ lead }) => {
  const navigate = useNavigate();

  const navigateToLeadItem = () => {
    navigate(`/leads/${lead.id}`);
  };

  console.log(lead);

  return (
    <Box
      onClick={navigateToLeadItem}
      tabIndex={0}
      sx={{
        p: {
          xs: 1,
          sm: 3,
        },
        maxWidth: "100%",
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 7,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={1}>
        <Typography
          sx={{
            fontSize: 20,
          }}
        >
          Заказщик: {lead?.customer?.name || "Не указан"}
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: {
              xs: "flex-start",
              sm: "flex-end",
            },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
            }}
          >
            #{lead.num || "—"}
          </Typography>

          <RenderStatus status={lead.status} />
        </Stack>

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
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              {lead?.from_location?.address || lead?.from || "Битые данные"}
            </Typography>
          </Box>

          <ArrowDownwardRoundedIcon
            sx={{
              color: "text.secondary",
              fontSize: 15,
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
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              {lead?.to_location?.address || lead?.from || "Битые данные"}
            </Typography>
          </Box>
        </Box>

        <InfoField
          label="Цена"
          value={lead?.price ? `${lead?.price} ${lead?.currency}` : "Не указан"}
        />
      </Stack>
    </Box>
  );
};

export default LeadCard;
