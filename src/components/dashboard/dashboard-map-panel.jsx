import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import FocusTrap from "@mui/material/Unstable_TrapFocus";
import CloseRounded from "@mui/icons-material/CloseRounded";
import FullscreenRounded from "@mui/icons-material/FullscreenRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import Map from "./map";
import LeadMapStatusFilter from "./lead-map-status-filter";
import RenderStatus from "../../shared/ui/render-status";

const DashboardMapPanel = ({
  leads,
  isLoading,
  selectedLeadId,
  highlightedLeadId,
  onSelectLead,
  selectedStatuses,
  onStatusChange,
  onResetStatuses,
}) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [expanded, setExpanded] = useState(false);
  const expandButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const selectedLead = leads.find((lead) => String(lead.id) === String(selectedLeadId));

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    const expandButton = expandButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      expandButton?.focus({ preventScroll: true });
    };
  }, [expanded]);

  return (
    <FocusTrap open={expanded}>
      <Paper
        component="section"
        variant="outlined"
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded ? true : undefined}
        aria-labelledby={titleId}
        tabIndex={expanded ? -1 : undefined}
        onKeyDown={(event) => {
          if (expanded && event.key === "Escape" && !event.defaultPrevented) {
            event.stopPropagation();
            setExpanded(false);
          }
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: { xs: "auto", lg: "100%" },
          borderRadius: { xs: 4, sm: 3 },
          overflow: "hidden",
          ...(expanded && {
            position: "fixed",
            inset: 0,
            zIndex: "modal",
            height: "100dvh",
            border: 0,
            borderRadius: 0,
            pt: "env(safe-area-inset-top, 0px)",
            pb: "env(safe-area-inset-bottom, 0px)",
            pl: "env(safe-area-inset-left, 0px)",
            pr: "env(safe-area-inset-right, 0px)",
          }),
        }}
      >
        <Box sx={{
          p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0,
          "@media (max-height: 500px) and (pointer: coarse)": {
            display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(160px, .7fr)", gap: 2,
            "& > button": { mt: 0 },
          },
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box sx={{ display: "flex", p: 1, borderRadius: 2, bgcolor: "background.main", color: "primary.main" }}>
              <RouteRounded fontSize="small" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography id={titleId} component="h2" sx={{ fontSize: 16, fontWeight: 700, color: "font_color.heading" }}>
                {t("dashboard.lead_map")}
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: 12, color: "text.secondary", display: expanded ? { xs: "none", sm: "block" } : "block", "@media (max-height: 500px) and (pointer: coarse)": { display: "none" } }}>
                {t("dashboard.active_lead_routes")}
              </Typography>
            </Box>
            <IconButton
              ref={expandButtonRef}
              aria-label={t("dashboard.expand_map")}
              onClick={() => setExpanded(true)}
              sx={{ display: expanded ? "none" : "inline-flex", width: 44, height: 44, bgcolor: "action.hover", borderRadius: 2.5 }}
            >
              <FullscreenRounded />
            </IconButton>
            {expanded && (
              <IconButton ref={closeButtonRef} aria-label={t("dashboard.collapse_map")} onClick={() => setExpanded(false)} sx={{ width: 44, height: 44 }}>
                <CloseRounded />
              </IconButton>
            )}
          </Box>
          <LeadMapStatusFilter selectedStatuses={selectedStatuses} onChange={onStatusChange} onReset={onResetStatuses} />
        </Box>

        <Map
          leads={leads}
          isLoading={isLoading}
          selectedLeadId={selectedLeadId}
          highlightedLeadId={highlightedLeadId}
          onSelectLead={onSelectLead}
          expanded={expanded}
        />

        {selectedLead && (
          <Box sx={{
            display: { xs: "block", sm: expanded ? "block" : "none" }, p: 1.5,
            borderTop: "1px solid", borderColor: "divider", flexShrink: 0,
            maxHeight: expanded ? "35dvh" : undefined, overflowY: "auto",
            "@media (max-height: 500px) and (pointer: coarse)": {
              display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr) auto", alignItems: "center", gap: 1, p: 1,
              "& > .MuiBox-root": { mb: 0 },
              "& > .MuiButton-root": { mt: 0, maxWidth: 180 },
            },
          }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.25 }}>
                  {t("dashboard.lead_number", { number: selectedLead.num || "—" })}
                </Typography>
                <RenderStatus status={selectedLead.status} />
              </Box>
              <IconButton aria-label={t("dashboard.clear_map_selection")} onClick={() => onSelectLead(null)} sx={{ width: 44, height: 44 }}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)", gap: 1, alignItems: "center" }}>
              {["from_location", "to_location"].map((key, index) => (
                <Box key={key} sx={{ minWidth: 0, gridColumn: index ? 3 : 1, gridRow: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}>
                    {t(index ? "dashboard.destination" : "dashboard.origin")}
                  </Typography>
                  <Typography title={selectedLead[key]?.address} sx={{ fontSize: 12, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere" }}>
                    {selectedLead[key]?.address || t("dashboard.address_not_specified")}
                  </Typography>
                </Box>
              ))}
              <ArrowForwardRounded sx={{ gridColumn: 2, gridRow: 1, fontSize: 18, color: "primary.main", "[dir=rtl] &": { transform: "rotate(180deg)" } }} />
            </Box>
            <Button component={RouterLink} to={`/leads/${selectedLead.id}`} onClick={() => setExpanded(false)} fullWidth size="small" sx={{ mt: 1, minHeight: 44, borderRadius: 2, textTransform: "none", bgcolor: "background.main" }}>
              {t("dashboard.lead_details_link")}
            </Button>
          </Box>
        )}
      </Paper>
    </FocusTrap>
  );
};

export default DashboardMapPanel;
