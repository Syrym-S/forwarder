import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box, Button, ButtonBase, Checkbox, Chip, ClickAwayListener, Collapse,
  Drawer, FormControl, FormControlLabel, FormGroup, FormLabel,
  IconButton, Typography, useMediaQuery,
} from "@mui/material";
import { LEAD_MAP_STATUS_OPTIONS } from "../../shared/const/lead-map-statuses";

const LeadMapStatusFilter = ({ selectedStatuses, onChange, onReset }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(
    (theme) => `${theme.breakpoints.down("sm")}, (max-height: 500px) and (pointer: coarse)`,
  );
  const optionsId = useId();
  const titleId = useId();
  const selectedOptions = LEAD_MAP_STATUS_OPTIONS.filter(({ value }) => selectedStatuses.includes(value));

  const options = (
    <FormGroup id={optionsId} aria-labelledby={titleId} sx={{
      display: "grid",
      gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
      gap: 0.5, p: 1.25,
    }}>
      {LEAD_MAP_STATUS_OPTIONS.map(({ value, label, color }) => (
        <FormControlLabel key={value} label={t(label)} sx={{
          m: 0, minWidth: 0, minHeight: 48, px: 0.5, borderRadius: 2,
          bgcolor: selectedStatuses.includes(value) ? `${color}0d` : "transparent",
          "&:hover": { bgcolor: "action.hover" },
          "& .MuiFormControlLabel-label": { fontSize: 13, overflowWrap: "anywhere" },
        }} control={
          <Checkbox value={value} checked={selectedStatuses.includes(value)} onChange={onChange}
            icon={<Box component="span" sx={{ width: 22, height: 22, border: "1.5px solid", borderColor: color, borderRadius: 1 }} />}
            checkedIcon={
              <Box component="span" sx={{ width: 22, height: 22, bgcolor: color, borderRadius: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <CheckRounded sx={{ fontSize: 17 }} />
              </Box>
            }
            sx={{ p: 1.25, color, "&.Mui-checked": { color } }}
          />
        } />
      ))}
    </FormGroup>
  );

  if (isMobile) {
    return (
      <>
        <ButtonBase
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? optionsId : undefined}
          sx={{
            mt: 1.5, width: "100%", minHeight: 44, px: 1.5, gap: 1,
            borderRadius: 2.5, bgcolor: "action.hover", justifyContent: "flex-start",
            "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main" },
          }}
        >
          <TuneRounded sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography component="span" sx={{ fontSize: 13, fontWeight: 600 }}>
            {t("dashboard.status")}
          </Typography>
          <Box component="span" sx={{ minWidth: 22, px: 0.5, borderRadius: 1, bgcolor: "background.paper", fontSize: 12, fontWeight: 700, color: "primary.main" }}>
            {selectedOptions.length}
          </Box>
          <Box component="span" aria-hidden="true" sx={{ display: "flex", gap: 0.5, ml: "auto" }}>
            {selectedOptions.slice(0, 4).map(({ value, color }) => (
              <Box component="span" key={value} sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color }} />
            ))}
          </Box>
          <ExpandMoreRounded sx={{ fontSize: 20, color: "text.secondary" }} />
        </ButtonBase>
        <Drawer
          anchor="bottom"
          open={open}
          disablePortal
          onClose={(event) => {
            event.stopPropagation();
            setOpen(false);
          }}
          slotProps={{ paper: {
            role: "dialog",
            "aria-modal": true,
            "aria-labelledby": titleId,
            sx: {
              maxHeight: "85dvh", borderRadius: "24px 24px 0 0",
              pb: "env(safe-area-inset-bottom, 0px)",
              pl: "env(safe-area-inset-left, 0px)",
              pr: "env(safe-area-inset-right, 0px)",
            },
          } }}
        >
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: "divider", mx: "auto", mt: 1.25, flexShrink: 0 }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 0.5, flexShrink: 0 }}>
            <Typography id={titleId} component="h3" sx={{ fontSize: 17, fontWeight: 700 }}>
              {t("dashboard.status")}
            </Typography>
            <IconButton aria-label={t("ui.close")} onClick={() => setOpen(false)} sx={{ width: 44, height: 44 }}>
              <CloseRounded />
            </IconButton>
          </Box>
          <Box sx={{ overflowY: "auto", overscrollBehavior: "contain", minHeight: 0 }}>{options}</Box>
          <Box sx={{ display: "flex", gap: 1, p: 2, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
            {onReset && <Button onClick={onReset} sx={{ minHeight: 44, borderRadius: 2.5, textTransform: "none" }}>{t("dashboard.reset_map_filters")}</Button>}
            <Button variant="contained" disableElevation onClick={() => setOpen(false)} sx={{ flex: 1, minHeight: 44, borderRadius: 2.5, textTransform: "none" }}>
              {t("dashboard.show_map")}
            </Button>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <FormControl component="fieldset" onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          event.currentTarget.querySelector("button")?.focus();
        }
      }} sx={{ m: 0, mt: 1.5, p: 0, minWidth: 0, width: "100%", border: 0 }}>
        <FormLabel id={titleId} component="legend" sx={{ mb: 0.75, fontSize: 13, fontWeight: 600 }}>{t("dashboard.status")}</FormLabel>
        <Box sx={{ bgcolor: "action.hover", borderRadius: 2.5, overflow: "hidden" }}>
          <ButtonBase onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={open ? optionsId : undefined} sx={{
            width: "100%", justifyContent: "space-between", gap: 1, p: 1.25, minHeight: 56, borderRadius: 2.5,
            "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 },
          }}>
            <Box component="span" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75, minWidth: 0 }}>
              {selectedOptions.map(({ value, label, color }) => (
                <Chip key={value} component="span" label={t(label)} title={t(label)} sx={{ bgcolor: color, color: "#fff", borderRadius: 1.5, minWidth: 0, maxWidth: "100%", fontSize: 12, "& .MuiChip-label": { px: 1.25 } }} />
              ))}
              {!selectedOptions.length && <Typography component="span" sx={{ px: 0.5, fontSize: 13, color: "text.secondary" }}>{t("ui.not_selected")}</Typography>}
            </Box>
            <ExpandMoreRounded sx={{ flexShrink: 0, color: "text.secondary", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease" }} />
          </ButtonBase>
          <Collapse in={open} unmountOnExit>{options}</Collapse>
        </Box>
      </FormControl>
    </ClickAwayListener>
  );
};

export default LeadMapStatusFilter;
