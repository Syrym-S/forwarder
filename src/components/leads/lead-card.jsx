import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import { Typography, Box, Stack } from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";
import LeadStatus from "../../shared/ui/lead-status";
import { isDraftLead } from "../../shared/lib/lead-draft";
import InfoItem from "../../shared/ui/info-item";
import { useTranslation } from "react-i18next";

const LeadCard = ({ lead }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToLeadItem = () => {
    navigate(`/leads/${lead.id}`);
  };

  return (
    <Box
      onClick={navigateToLeadItem}
      tabIndex={0}
      sx={{
        p: 3,
        maxWidth: "100%",
        border: "2px solid",
        borderColor: isDraftLead(lead) ? "warning.main" : "divider",
        borderRadius: 4,
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
            }}
          >
            {t("active_leads.customer")}: {lead?.customer?.name || t("active_leads.not_specified")}
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

            <LeadStatus lead={lead} />
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
                {t("active_leads.origin")}
              </Typography>
            </Box>

            <Typography
              fontWeight={500}
              sx={{
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              {lead?.from_location?.address || lead?.from || t("active_leads.not_specified")}
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
                {t("active_leads.destination")}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.35,
              }}
            >
              {lead?.to_location?.address || lead?.from || t("active_leads.not_specified")}
            </Typography>
          </Box>
        </Box>

        <InfoItem
          label={t("active_leads.customer_price")}
          value={`${moneySpacingFormat(lead?.price)} ${lead?.currency}`}
        />

        <InfoItem
          label={t("active_leads.your_lead_price")}
          value={`${moneySpacingFormat(lead?.transportation_price)} ${lead?.currency}`}
        />
      </Stack>
    </Box>
  );
};

export default LeadCard;
