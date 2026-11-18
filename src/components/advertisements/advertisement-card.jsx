import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "react-router-dom";
import InfoItem from "../../shared/ui/info-item";
import ContactValue from "../../shared/ui/contact-value";
import LeadStatus from "../../shared/ui/lead-status";
import {
  formatAdvertisementDate,
  formatAdvertisementPrice,
  getAdvertisementAddress,
  getAdvertisementStart,
  getAdvertisementDetailsPath,
} from "../../features/advertisements/model";
import { RenderStatusContent } from "../../shared/ui/render-status";

const AdvertisementCard = ({ advertisement, source = "my" }) => {
  const { t } = useTranslation();
  const lead = advertisement.lead || {};
  const customerPhone = String(lead.customer?.tel ?? "").trim();
  const cargoNames = lead.cargos
    ?.map((cargo) => cargo.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        minWidth: 0,
        "& .MuiTypography-root": { overflowWrap: "anywhere" },
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography component="h2" sx={{ fontSize: 16, fontWeight: 600 }}>
            {t("ui.lead_number_column")}: {lead.num ?? "—"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RenderStatusContent
              label={
                advertisement.closed_at
                  ? t("dashboard.closed")
                  : t("dashboard.new")
              }
              variant="outlined"
              color={advertisement.closed_at ? "#c60606" : "#49b439"}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "minmax(0, 1fr) auto minmax(0, 1fr)",
            },
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {t("ui.origin")}
            </Typography>
            <Typography sx={{ fontSize: 13, overflowWrap: "anywhere" }}>
              {getAdvertisementAddress(lead.from_location)}
            </Typography>
          </Box>
          <ArrowForwardRoundedIcon
            sx={(theme) => ({
              color: "primary.main",
              justifySelf: "center",
              transform: {
                xs: "rotate(90deg)",
                sm: theme.direction === "rtl" ? "rotate(180deg)" : "none",
              },
            })}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {t("ui.destination")}
            </Typography>
            <Typography sx={{ fontSize: 13, overflowWrap: "anywhere" }}>
              {getAdvertisementAddress(lead.to_location)}
            </Typography>
          </Box>
        </Box>

        {lead.waypoints?.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {t("ui.waypoints_count", { value1: lead.waypoints.length })}
          </Typography>
        )}
        {cargoNames && (
          <Typography sx={{ fontSize: 13, overflowWrap: "anywhere" }}>
            {t("ui.cargo")}: {cargoNames}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 1,
          }}
        >
          <InfoItem
            label={t("ui.start_date")}
            value={formatAdvertisementDate(getAdvertisementStart(lead))}
          />
          <InfoItem
            label={t("advertisements.expires_at")}
            value={formatAdvertisementDate(advertisement.expired_at)}
          />
          <InfoItem
            label={t("ui.customer_price")}
            value={formatAdvertisementPrice(lead.price, lead.currency)}
          />
          <InfoItem
            label={t("ui.your_lead_price")}
            value={formatAdvertisementPrice(
              lead.transportation_price,
              lead.currency,
            )}
          />
        </Box>

        {source === "customer" && (
          <InfoItem
            label={`${t("ui.customer")}: ${t("ui.phone_2")}`}
            value={
              customerPhone ? (
                <ContactValue value={customerPhone} type="phone" />
              ) : null
            }
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {t("ui.publication_date")}:{" "}
            {formatAdvertisementDate(advertisement.created_at)}
          </Typography>
          <Button
            component={Link}
            to={getAdvertisementDetailsPath(advertisement.id, source)}
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {t("ui.details")}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AdvertisementCard;
