import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import {
  calculateCargoVolume,
  cargoDimensionFields,
  hasCargoValue,
  isPositiveCargoNumber,
} from "../../../shared/lib/cargo-volume";

const labelKeys = ["lead_form.length_cm", "lead_form.width_cm", "lead_form.height_cm"];

export default function CargoVolumeFields({ control, index }) {
  const { t } = useTranslation();
  const prefix = `cargos.${index}`;
  const cargo = useWatch({ control, name: prefix }) || {};
  const calculatedVolume = calculateCargoVolume(cargo);

  return (
    <Box sx={{ gridColumn: "1 / -1", display: "grid", gap: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {cargoDimensionFields.map((key, dimensionIndex) => (
          <FormControllerInput
            key={key}
            name={`${prefix}.${key}`}
            control={control}
            rules={{
              validate: (value) =>
                !hasCargoValue(value) ||
                isPositiveCargoNumber(value) ||
                t("lead_form.dimension_must_be_positive"),
            }}
            value={cargo[key] ?? ""}
            label={t(labelKeys[dimensionIndex])}
            type="number"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 0, step: "any" } }}
          />
        ))}
      </Box>

      <FormControllerInput
        name={`${prefix}.cargo_demention`}
        control={control}
        rules={{
          validate: (value) =>
            !hasCargoValue(value) ||
            isPositiveCargoNumber(value) ||
            t("lead_form.volume_must_be_positive"),
        }}
        value={
          hasCargoValue(cargo.cargo_demention)
            ? cargo.cargo_demention
            : (calculatedVolume ?? "")
        }
        label={t("lead_form.cargo_volume_m3")}
        type="number"
        size="small"
        fullWidth
        slotProps={{ htmlInput: { min: 0, step: "any" } }}
      />

      <Typography variant="body2" color="text.secondary">{t("lead_form.cargo_volume_hint")}</Typography>

      {/* <Typography variant="body2" color="text.secondary" aria-live="polite">
        {calculatedVolume !== null
          ? `Объём по габаритам: ${calculatedVolume} м³ (длина × ширина × высота ÷ 1 000 000).${hasCargoValue(cargo.cargo_demention) ? " Будет использован введённый объём." : " Будет сохранён автоматически."}`
          : "Калькулятор объёма: заполните длину, ширину и высоту в сантиметрах."}
      </Typography> */}
    </Box>
  );
}
