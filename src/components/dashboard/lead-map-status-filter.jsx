import CheckRounded from "@mui/icons-material/CheckRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  ButtonBase,
  Checkbox,
  Chip,
  ClickAwayListener,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";
import { LEAD_MAP_STATUS_OPTIONS } from "../../shared/const/lead-map-statuses";

const LeadMapStatusFilter = ({ selectedStatuses, onChange }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const selectedOptions = LEAD_MAP_STATUS_OPTIONS.filter(({ value }) =>
    selectedStatuses.includes(value),
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <FormControl
        component="fieldset"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.stopPropagation();
            setOpen(false);
            event.currentTarget.querySelector("button")?.focus();
          }
        }}
        sx={{ m: 0, mt: 1.5, p: 0, minWidth: 0, width: "100%", border: 0 }}
      >
        <FormLabel
          component="legend"
          sx={{ mb: 0.75, fontSize: 13, fontWeight: 600 }}
        >
          {t("dashboard.status")}
        </FormLabel>
        <Box
          sx={{
            bgcolor: "action.hover",
            borderRadius: 2.5,
            overflow: "hidden",
          }}
        >
          <ButtonBase
            onClick={() => setOpen((value) => !value)}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              gap: 1,
              p: 1.25,
              minHeight: 56,
              borderRadius: 2.5,
              "&.Mui-focusVisible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: -2,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 0.75,
                minWidth: 0,
              }}
            >
              {selectedOptions.map(({ value, label, color }) => (
                <Chip
                  key={value}
                  component="span"
                  label={t(label)}
                  title={t(label)}
                  sx={{
                    bgcolor: color,
                    color: "#fff",
                    borderRadius: 1.5,
                    minWidth: 0,
                    maxWidth: "100%",
                    fontSize: 12,
                    "& .MuiChip-label": { px: 1.25 },
                  }}
                />
              ))}
              {selectedOptions.length === 0 && (
                <Typography
                  component="span"
                  sx={{ px: 0.5, fontSize: 13, color: "text.secondary" }}
                >
                  {t("ui.not_selected")}
                </Typography>
              )}
            </Box>
            <ExpandMoreRounded
              sx={{
                flexShrink: 0,
                color: "text.secondary",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 180ms ease",
              }}
            />
          </ButtonBase>
          <Collapse in={open} unmountOnExit>
            <FormGroup
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: 1,
                rowGap: 0.5,
                px: 1.25,
                pt: 0.5,
                pb: 1.25,
              }}
            >
              {LEAD_MAP_STATUS_OPTIONS.map(({ value, label, color }) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      size="small"
                      value={value}
                      checked={selectedStatuses.includes(value)}
                      onChange={onChange}
                      icon={
                        <Box
                          component="span"
                          sx={{
                            width: 22,
                            height: 22,
                            border: "1.5px solid",
                            borderColor: color,
                            borderRadius: 1,
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          component="span"
                          sx={{
                            width: 22,
                            height: 22,
                            bgcolor: color,
                            borderRadius: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                          }}
                        >
                          <CheckRounded sx={{ fontSize: 17 }} />
                        </Box>
                      }
                      sx={{ p: 0.75, color, "&.Mui-checked": { color } }}
                    />
                  }
                  label={t(label)}
                  sx={{
                    m: 0,
                    minWidth: 0,
                    borderRadius: 1.5,
                    alignItems: "center",
                    "&:hover": { bgcolor: "action.hover" },
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                      overflowWrap: "anywhere",
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>
      </FormControl>
    </ClickAwayListener>
  );
};

export default LeadMapStatusFilter;
