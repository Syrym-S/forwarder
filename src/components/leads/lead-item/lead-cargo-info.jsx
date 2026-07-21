import React from "react";
import Section from "../../../shared/ui/section";
import { Box, Button, CircularProgress } from "@mui/material";
import InfoField from "../../../shared/ui/info-field";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RenderStatus from "../../../shared/ui/render-status";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const LeadCargoInfo = ({ cargo, leadId, index, cargosCount }) => {
  const isLoading = useLeadsStore((state) => state.isLoading);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const deleteCargo = useLeadsStore((state) => state.deleteCargo);
  const isCargoDeleteLoading = useLeadsStore(
    (state) => state.isCargoDeleteLoading,
  );

  const handleDeleteCargo = async () => {
    await deleteCargo(leadId, index);
    await getLeadItem(leadId);
  };

  if (isCargoDeleteLoading || isLoading)
    return (
      <Section
        title={`Груз ${cargo?.name}`}
        icon={<LocalShippingOutlinedIcon color="primary" />}
      >
        <CircularProgress />
      </Section>
    );

  return (
    <Section
      title={`Груз ${cargo?.name}`}
      icon={<LocalShippingOutlinedIcon color="primary" />}
    >
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
        <InfoField label="Тип" value={cargo?.type} />

        <InfoField
          label="Вес"
          value={cargo?.weight_kg ? `${cargo?.weight_kg} кг` : "Вес не указан"}
        />
      </Box>

      <InfoField label="Описание" value={`${cargo?.description || "--"}`} />
      {cargosCount !== 1 && (
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
    </Section>
  );
};

export default LeadCargoInfo;
