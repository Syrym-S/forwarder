import React from "react";
import Section from "../../shared/ui/section";
import Inventory2SharpIcon from "@mui/icons-material/Inventory2Sharp";
import CargosVerificationContainer from "./cargos-verification-container";

const LeadCargoFilesContainer = ({ cargoActions }) => {
  console.log("LeadCargoLoadingFilesContainer", cargoActions);
  return (
    <Section
      title="Информация о погрузках и разгрузках"
      icon={<Inventory2SharpIcon color="primary" />}
    >
      {cargoActions.map((cargoAction) => {
        return <CargosVerificationContainer cargoAction={cargoAction} />;
      })}
    </Section>
  );
};

export default LeadCargoFilesContainer;
