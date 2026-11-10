import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, ClickAwayListener, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ActionTooltip from "../../shared/ui/action-tooltip";

const CustomerCargoTooltip = ({ lead }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const cargos =
    Array.isArray(lead.cargos) && lead.cargos.length
      ? lead.cargos
      : lead.cargo
        ? [lead.cargo]
        : lead.cargo_name
          ? [{ name: lead.cargo_name }]
          : [];

  if (!cargos.length) {
    return (
      <Button size="small" disabled startIcon={<Inventory2OutlinedIcon />}>
        {t("ui.view_cargo")}
      </Button>
    );
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box component="span" sx={{ display: "inline-flex", mb: 1 }}>
        <ActionTooltip
          describeChild
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          disableInteractive={false}
          title={
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2,
                pr: 0.5,
                maxHeight: 240,
                overflowY: "auto",
                overflowWrap: "anywhere",
              }}
            >
              {cargos.map((cargo, index) => (
                <Box component="li" key={cargo.id ?? index} sx={{ py: 0.5 }}>
                  <Typography component="span" variant="body2" color="inherit">
                    {typeof cargo === "string"
                      ? cargo
                      : cargo.name ||
                        t("ui.cargo_number", { value1: index + 1 })}
                  </Typography>
                  {cargo.weight_kg != null && cargo.weight_kg !== "" && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="inherit"
                      sx={{ display: "block", opacity: 0.8 }}
                    >
                      {t("ui.weight_kilograms", { value1: cargo.weight_kg })}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          }
        >
          <Button
            size="small"
            startIcon={<Inventory2OutlinedIcon />}
            onClick={() => setOpen(true)}
            sx={{ textTransform: "none" }}
          >
            {t("ui.view_cargo")} ({cargos.length})
          </Button>
        </ActionTooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default CustomerCargoTooltip;
