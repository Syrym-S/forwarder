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
}) => {
  const canEditStatus =
    lead?.status === STATUS.new || lead?.status === STATUS.add_driver;
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
        borderRadius: 5,
        backgroundColor: "rgb(250, 250, 250)",
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
            md: "repeat(4, 1fr)",
          },
          gap: 1.2,
          mb: 1.2,
        }}
      >
        <InfoItem label="Наименование" value={cargo?.name} />

        <InfoItem label="Тип" value={cargo?.type} />

        <InfoItem
          label="Вес"
          value={cargo?.weight_kg ? `${cargo?.weight_kg} кг` : "Вес не указан"}
        />

        <InfoItem label="Цена груза" value={cargo?.cargo_price} />

        <InfoItem
          label="Размеры"
          value={`${cargo?.height_cm || "-"} x ${cargo?.width_cm || "-"} x ${cargo?.length_cm || "-"}`}
        />
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
