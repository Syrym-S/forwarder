import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import { getCargoVolume } from "../../../shared/lib/cargo-volume";
import InfoItem from "../../../shared/ui/info-item";
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
  const canEditStatus =
    lead?.status === STATUS.new || lead?.status === STATUS.add_driver;
  const tnvedCode = cargo?.tnved?.code ?? cargo?.tnved_code ??
    (typeof cargo?.tnved === "string" ? cargo.tnved : "");
  const tnvedLabel = [tnvedCode, cargo?.tnved?.name].filter(Boolean).join(" — ");
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
      >
        Груз #{index + 1}
      </Typography>

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
        <InfoItem label="Наименование" value={cargo?.name} />

        <InfoItem label="Тип" value={cargo?.type} />

        <InfoItem label="Код товара" value={tnvedLabel || "Не указан"} />

        <InfoItem
          label="Вес"
          value={cargo?.weight_kg ? `${cargo?.weight_kg} кг` : "Вес не указан"}
        />

        {!hidePrices && (
          <InfoItem
            label="Цена груза"
            value={moneySpacingFormat(cargo?.cargo_price)}
          />
        )}

        {getCargoVolume(cargo) != null && (
          <InfoItem label="Объём" value={`${getCargoVolume(cargo)} м³`} />
        )}
        {(cargo?.height_cm || cargo?.width_cm || cargo?.length_cm) && (
          <InfoItem
            label="Размеры"
            value={[
              cargo.length_cm && `Длина: ${cargo.length_cm} см`,
              cargo.width_cm && `Ширина: ${cargo.width_cm} см`,
              cargo.height_cm && `Высота: ${cargo.height_cm} см`,
            ]
              .filter(Boolean)
              .join(" × ")}
          />
        )}
      </Box>

      <InfoItem label="Описание" value={`${cargo?.description || "--"}`} />
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
          )}
          Удалить груз
        </Button>
      )}
    </Box>
  );
};

export default CargoCard;
