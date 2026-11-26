import { Box, Paper, Typography } from "@mui/material";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LeadStatus from "../../shared/ui/lead-status";
import { isDraftLead } from "../../shared/lib/lead-draft";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";

const LeadCard = ({ lead }) => {
  const { t } = useTranslation();
  const isDraft = isDraftLead(lead);
  const points = [
    { label: "active_leads.origin", location: lead.from_location, fallback: lead.from },
    { label: "active_leads.destination", location: lead.to_location, fallback: lead.to },
  ];
  const participants = [
    {
      label: "active_leads.driver",
      name: lead.driver?.fio,
      icon: PersonOutlineRounded,
      vehicle: lead.driver?.vehicle_number,
    },
    {
      label: "active_leads.customer",
      name: lead.customer?.name,
      icon: BusinessOutlined,
    },
  ];

  const formatPrice = (value) => {
    if (value == null || String(value).trim() === "") return "—";
    return [moneySpacingFormat(value), lead.currency].filter(Boolean).join(" ");
  };

  return (
    <Paper
      component={RouterLink}
      to={`/leads/${lead.id}`}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        p: 2,
        borderRadius: 3,
        textDecoration: "none",
        color: "font_color.heading",
        borderColor: isDraft ? "warning.light" : "divider",
        bgcolor: "background.paper",
        boxShadow: "0 2px 8px rgba(22, 36, 62, 0.03)",
        transition: "border-color 150ms, box-shadow 150ms",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 16px rgba(22, 36, 62, 0.08)",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 3,
        },
        "& .MuiTypography-root": { overflowWrap: "anywhere" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
          <LocalShippingOutlined sx={{ fontSize: 19, color: "primary.main", flexShrink: 0 }} />
          <Typography
            component="span"
            aria-label={t("ui.lead_number", { value1: lead.num ?? "—" })}
            sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}
          >
            #{lead.num ?? "—"}
          </Typography>
        </Box>
        <LeadStatus lead={lead} />
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "grid",
          gap: 1.5,
          paddingInlineStart: "22px",
          mb: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            insetInlineStart: "4px",
            top: 8,
            bottom: 18,
            borderInlineStart: "1px dashed",
            borderColor: "divider",
          },
        }}
      >
        {points.map(({ label, location, fallback }, index) => {
          const address = location?.address ||
            (typeof fallback === "string" ? fallback : "") ||
            location?.city || t("ui.address_not_specified");

          return (
            <Box key={label} sx={{ position: "relative", minWidth: 0 }}>
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  insetInlineStart: "-22px",
                  top: 4,
                  width: 9,
                  height: 9,
                  boxSizing: "border-box",
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: index ? 1 : "50%",
                  bgcolor: index ? "primary.main" : "background.paper",
                }}
              />
              <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}>
                {t(label)}
              </Typography>
              <Typography
                title={address}
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.45,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {address}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          mb: 1.5,
        }}
      >
        {participants.map((participant) => {
          const { label, name, icon: Icon, vehicle } = participant;
          return (
            <Box key={label} sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <Icon sx={{ fontSize: 15, color: "text.secondary", flexShrink: 0 }} />
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {t(label)}
                </Typography>
              </Box>
              <Typography
                title={name || undefined}
                sx={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {name || t("active_leads.not_specified")}
              </Typography>
              {vehicle && (
                <Typography
                  component="bdi"
                  dir="auto"
                  aria-label={`${t("ui.vehicle_number")}: ${vehicle}`}
                  sx={{ display: "inline-block", mt: 0.5, px: 0.75, py: 0.125, borderRadius: 1, bgcolor: "background.default", fontSize: 10, fontWeight: 600 }}
                >
                  {vehicle}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
          p: 1.25,
          mt: "auto",
          borderRadius: 2,
          bgcolor: "background.default",
        }}
      >
        {[
          ["active_leads.customer_price", lead.price],
          ["active_leads.your_lead_price", lead.transportation_price],
        ].map(([label, value]) => (
          <Box key={label} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.5, lineHeight: 1.4 }}>
              {t(label)}
            </Typography>
            <Typography component="bdi" dir="auto" sx={{ display: "block", fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {formatPrice(value)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, pt: 1.25, color: "primary.main" }}>
        <Typography component="span" sx={{ fontSize: 12, fontWeight: 600 }}>
          {t("dashboard.lead_details_link")}
        </Typography>
        <ChevronRightRounded sx={{ fontSize: 18, flexShrink: 0, transform: (theme) => theme.direction === "rtl" ? "rotate(180deg)" : "none" }} />
      </Box>
    </Paper>
  );
};

export default LeadCard;
