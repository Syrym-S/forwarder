import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const isFilesEmpty = cargoActions.length === 0;

  return (
    <Section
      title={t("ui.loading_unloading_information")}
      icon={<Inventory2SharpIcon color="primary" />}
    >
      {pass_verify && (
        <Alert severity="info" sx={{ mb: 2 }}>{t("ui.forwarder_file_confirmation_not_required")}</Alert>
      )}
      {isFilesEmpty && !pass_verify && (
        <Alert severity="info">{t("ui.uploaded_file_list_empty")}</Alert>
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
