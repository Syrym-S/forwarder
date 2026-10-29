import { useTranslation } from "react-i18next";
import React from "react";
import { Box, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";

const FactoringCargoInfo = ({ cargo }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        fontWeight={600}
        sx={{
          py: 1,
        }}
      >{t("ui.cargo_number", { value1: cargo.name })}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <InfoField label={t("ui.type")} value={cargo?.type} />

        <InfoField
          label={t("ui.weight")}
          value={cargo?.weight_kg ? t("ui.weight_kilograms", { value1: cargo?.weight_kg }) : t("ui.weight_not_specified")}
        />
      </Box>

      <InfoField label={t("ui.description")} value={`${cargo?.description || "--"}`} />
    </Box>
  );
};

export default FactoringCargoInfo;
