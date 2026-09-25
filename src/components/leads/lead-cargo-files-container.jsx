import React from "react";
import Section from "./lead-item/lead-detail-section";
import Inventory2SharpIcon from "@mui/icons-material/Inventory2Sharp";
import CargosVerificationContainer from "./cargos-verification-container";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import { Alert } from "@mui/material";

const LeadCargoFilesContainer = ({ cargoActions = [], passVerify = false }) => {
  const isFilesEmpty = cargoActions.length === 0;

  return (
    <Section
      title="Информация о погрузках и разгрузках"
      icon={<Inventory2SharpIcon color="primary" />}
    >
      {passVerify && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Видеофиксация и подтверждение погрузки/разгрузки экспедитором не требуются.
        </Alert>
      )}
      {isFilesEmpty && !passVerify && (
        <Alert severity="info">Список загруженных файлов пуст</Alert>
      )}
      {cargoActions.map((cargoAction) => {
        return <CargosVerificationContainer cargoAction={cargoAction} passVerify={passVerify} />;
      })}
    </Section>
  );
};

export default LeadCargoFilesContainer;
