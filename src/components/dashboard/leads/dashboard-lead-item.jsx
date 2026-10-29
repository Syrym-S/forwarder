import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import RenderStatus from "../../../shared/ui/render-status";

function formatLocation(location, t) {
  return location?.address || t("dashboard.address_not_specified");
}

function formatLeadPrice(price, currency, t, language) {
  if (price === null || price === undefined || price === "") {
    return t("dashboard.price_not_specified");
  }

  return `${Number(price).toLocaleString(language)} ${currency || ""}`;
}

function hasRouteCoordinates(lead) {
  return Boolean(
    lead?.from_location?.lat &&
    lead?.from_location?.lon &&
    lead?.to_location?.lat &&
    lead?.to_location?.lon,
  );
}

const DashboardLeadItem = ({
  lead,
  isSelected,
  isHovered,
  onSelectLead,
  onHoverLead,
  onLeaveLead,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const leadId = lead?.id;
  const hasRoute = hasRouteCoordinates(lead);

  const handleClick = () => {
    onSelectLead?.(leadId);
  };

  const handleMouseEnter = () => {
    onHoverLead?.(leadId);
  };

  const handleMouseLeave = () => {
    onLeaveLead?.();
  };

  const handleDoubleClick = () => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <Paper
      variant="outlined"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      sx={{
        p: 1.5,
        borderRadius: 3,
        cursor: "pointer",
        transition: "0.2s ease",
        borderColor: isSelected || isHovered ? "primary.main" : "divider",
        backgroundColor: isSelected
          ? "background.main"
          : isHovered
            ? "rgba(33, 150, 243, 0.04)"
            : "background.paper",
      }}
    >
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Chip
            label={t("dashboard.lead_number", { number: lead?.num || "—" })}
            size="small"
            variant={isSelected ? "filled" : "outlined"}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              color: isSelected ? "common.white" : "primary.main",
              bgcolor: isSelected ? "primary.main" : "background.paper",
            }}
          />

          {lead?.status && <RenderStatus status={lead.status} />}
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("dashboard.origin")}
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.5,
              overflowWrap: "anywhere",
            }}
          >
            {formatLocation(lead?.from_location, t)}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("dashboard.destination")}
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.5,
              overflowWrap: "anywhere",
            }}
          >
            {formatLocation(lead?.to_location, t)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {t("dashboard.customer_price")}: {formatLeadPrice(lead?.price, lead?.currency, t, i18n.resolvedLanguage)}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {t("dashboard.your_lead_price")}:
            {formatLeadPrice(lead?.transportation_price, lead?.currency, t, i18n.resolvedLanguage)}
          </Typography>

          {!hasRoute && (
            <Chip
              label={t("dashboard.no_coordinates")}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
        <Button
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            handleDoubleClick();
          }}
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {t("dashboard.lead_details_link")}
        </Button>
      </Stack>
    </Paper>
  );
};

export default DashboardLeadItem;
