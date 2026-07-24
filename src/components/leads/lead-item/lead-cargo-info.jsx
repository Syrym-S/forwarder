import React from "react";
import Section from "../../../shared/ui/section";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import InfoField from "../../../shared/ui/info-field";
import RenderStatus from "../../../shared/ui/render-status";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";

const LeadCargoInfo = ({
  cargo,
  lead,
  index,
  cargosCount,
  isLeadsPage = false,
}) => {
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const deleteCargo = useLeadsStore((state) => state.deleteCargo);

  const handleDeleteCargo = async () => {
    await deleteCargo(lead.id, index);
    await getLeadItem(lead.id);
  };

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
      >
        Груз {cargo.name}
      </Typography>
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
        <InfoField label="Тип" value={cargo?.сargo_type} />

        <InfoField
          label="Вес"
          value={cargo?.weight_kg ? `${cargo?.weight_kg} кг` : "Вес не указан"}
        />
      </Box>

      <InfoField label="Описание" value={`${cargo?.description || "--"}`} />
      {cargosCount !== 1 && isLeadsPage && lead.status === STATUS.new && (
        <Button
          onClick={handleDeleteCargo}
          color="error"
          variant="outlined"
          sx={{
            my: 1,
          }}
        >
          Удалить груз
        </Button>
      )}
    </Box>
  );
};

export default LeadCargoInfo;
