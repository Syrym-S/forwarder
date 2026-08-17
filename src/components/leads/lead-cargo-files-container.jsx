import React from "react";
import Section from "../../shared/ui/section";
import Inventory2SharpIcon from "@mui/icons-material/Inventory2Sharp";
import CargosVerificationContainer from "./cargos-verification-container";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import { Alert } from "@mui/material";

const LeadCargoFilesContainer = ({ cargoActions }) => {
  const isFilesEmpty = cargoActions.length === 0;

  return (
    <Section
      title="Информация о погрузках и разгрузках"
      icon={<Inventory2SharpIcon color="primary" />}
    >
      {isFilesEmpty && (
        <Alert severity="info">Список загруженных файлов пуст</Alert>
      )}
      {cargoActions.map((cargoAction) => {
        return <CargosVerificationContainer cargoAction={cargoAction} />;
      })}
    </Section>
  );
};

export default LeadCargoFilesContainer;
