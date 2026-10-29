import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import { getCargoVolume } from "../../../shared/lib/cargo-volume";
import InfoItem from "../../../shared/ui/info-item";
import ActionTooltip from "../../../shared/ui/action-tooltip";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { STATUS } from "../../../shared/const/tenders";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const CargoCard = ({
  cargo,
  lead,
  index,
  cargosCount,
  isLeadsPage = false,
  hidePrices = false,
}) => {
  const { t } = useTranslation();
  const canEditStatus =
    lead?.status === STATUS.new || lead?.status === STATUS.add_driver;
  const tnvedCode = cargo?.tnved?.code ?? cargo?.tnved_code ??
    (typeof cargo?.tnved === "string" ? cargo.tnved : "");
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const deleteCargo = useLeadsStore((state) => state.deleteCargo);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const isCargoDeleteLoading = useLeadsStore(
    (state) => state.isCargoDeleteLoading,
  );

  const handleDeleteCargo = async () => {
    await deleteCargo(lead.id, index);
    await getLeadItem(lead.id);
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.default",
      }}
    >
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 600,
          mb: 1.5,
        }}
      >{t("ui.cargo_number_label", { value1: index + 1 })}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.2,
          mb: 1.2,
        }}
      >
        <InfoItem label={t("ui.item_name")} value={cargo?.name} />

        <InfoItem label={t("ui.type")} value={cargo?.type} />

        <InfoItem
          label={t("ui.product_code")}
          value={tnvedCode ? (
            <ActionTooltip title={cargo?.tnved?.name || ""}>
              <span>{tnvedCode}</span>
            </ActionTooltip>
          ) : t("ui.not_specified")}
        />

        <InfoItem
          label={t("ui.weight")}
          value={cargo?.weight_kg ? t("ui.weight_kilograms", { value1: cargo?.weight_kg }) : t("ui.weight_not_specified")}
        />

        {!hidePrices && (
          <InfoItem
            label={t("ui.cargo_price")}
            value={moneySpacingFormat(cargo?.cargo_price)}
          />
        )}

        {getCargoVolume(cargo) != null && (
          <InfoItem label={t("ui.volume")} value={t("ui.volume_cubic_meters", { value1: getCargoVolume(cargo) })} />
        )}
        {(cargo?.height_cm || cargo?.width_cm || cargo?.length_cm) && (
          <InfoItem
            label={t("ui.dimensions")}
            value={[
              cargo.length_cm && t("ui.length_centimeters", { value1: cargo.length_cm }),
              cargo.width_cm && t("ui.width_centimeters", { value1: cargo.width_cm }),
              cargo.height_cm && t("ui.height_centimeters", { value1: cargo.height_cm }),
            ]
              .filter(Boolean)
              .join(" × ")}
          />
        )}
      </Box>

      <InfoItem label={t("ui.description")} value={`${cargo?.description || "--"}`} />
      {cargosCount !== 1 && isLeadsPage && canEditStatus && (
        <Button
          onClick={handleDeleteCargo}
          color="error"
          variant="outlined"
          sx={{
            my: 1,
            borderRadius: 3,
            display: "flex",
            gap: 1,
          }}
        >
          {(isCargoDeleteLoading || isLoading) && (
            <CircularProgress size={13} />
          )}{t("ui.delete_cargo")}</Button>
      )}
    </Box>
  );
};

export default CargoCard;
