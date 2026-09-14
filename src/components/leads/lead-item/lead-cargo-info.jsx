import { Box, Button, Typography } from "@mui/material";
import { STATUS } from "../../../shared/const/tenders";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const InfoItem = ({ label, value }) => {
  return (
    <Box
      sx={{
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: "text.secondary",
          mb: 0.3,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 500,
          color: "text.primary",
          lineHeight: 1.3,
        }}
      >
        {value ?? "Не указано"}
      </Typography>
    </Box>
  );
};

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

  const handleDeleteCargo = async () => {
    await deleteCargo(lead.id, index);
    await getLeadItem(lead.id);
  };

  console.log(cargo);

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
          }}
        >
          Удалить груз
        </Button>
      )}
    </Box>
  );
};

export default CargoCard;
