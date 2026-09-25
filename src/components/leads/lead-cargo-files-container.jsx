import React from "react";
import Section from "./lead-item/lead-detail-section";
import Inventory2SharpIcon from "@mui/icons-material/Inventory2Sharp";
import CargosVerificationContainer from "./cargos-verification-container";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import { Alert } from "@mui/material";

const LeadCargoFilesContainer = ({
  cargoActions = [],
  pass_verify = false,
}) => {
  const isFilesEmpty = cargoActions.length === 0;

  return (
    <Section
      title="Информация о погрузках и разгрузках"
      icon={<Inventory2SharpIcon color="primary" />}
    >
      {pass_verify && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Подтверждение файлов погрузки/разгрузки экспедитором не требуется.
        </Alert>
      )}
      {isFilesEmpty && !pass_verify && (
        <Alert severity="info">Список загруженных файлов пуст</Alert>
      )}
      {cargoActions.map((cargoAction) => {
        return (
          <CargosVerificationContainer
            cargoAction={cargoAction}
            pass_verify={pass_verify}
          />
        );
      })}
    </Section>
  );
};

export default LeadCargoFilesContainer;
