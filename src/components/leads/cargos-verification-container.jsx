import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Section from "./lead-item/lead-detail-section";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { STATUS, WAYPOINT_TYPES } from "../../shared/const/tenders";
import { LeadDocumentCard } from "./documents/LeadDocumentCard";
import FileModal from "../tenders/file-modal";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const renderTitleText = (stage, isVerified) => {
  let title = "";

  if (stage === WAYPOINT_TYPES.loading && isVerified) {
    title = appI18n.t("ui.loading_confirmed");
  } else if (stage === WAYPOINT_TYPES.loading && !isVerified) {
    title = appI18n.t("ui.loading_confirmation");
  } else if (stage === WAYPOINT_TYPES.unloading && isVerified) {
    title = appI18n.t("ui.unloading_confirmed");
  } else if (stage === WAYPOINT_TYPES.unloading && !isVerified) {
    title = appI18n.t("ui.unloading_confirmation");
  }

  return title;
};

const CargosVerificationContainer = ({ cargoAction, pass_verify = false }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [currentFile, setCurrentFile] = useState(null);

  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const verifyCargoLoad = useLeadsStore((state) => state.verifyCargo);
  const rejectCargoLoad = useLeadsStore((state) => state.rejectCargo);
  const verifyCargoUnload = useLeadsStore((state) => state.verifyCargoUnload);
  const rejectCargoUnload = useLeadsStore((state) => state.rejectCargoUnload);
  const isLoadLoading = useLeadsStore((state) => state.isLoadLoading);
  const isUnloadLoading = useLeadsStore((state) => state.isUnloadLoading);

  const isVerified = cargoAction.is_verified;
  const title = pass_verify
    ? cargoAction.stage === WAYPOINT_TYPES.loading
      ? t("ui.loading_without_confirmation")
      : t("ui.unloading_without_confirmation")
    : renderTitleText(cargoAction.stage, isVerified);

  const handleVerifyCargoLoad = async () => {
    await verifyCargoLoad(id);
    await getLeadItem(id);
  };

  const handleRejectCargoLoad = async () => {
    await rejectCargoLoad(id);
    await getLeadItem(id);
  };

  const handleVerifyCargoUnload = async () => {
    await verifyCargoUnload(id);
    await getLeadItem(id);
  };

  const handleRejectCargoUnload = async () => {
    await rejectCargoUnload(id);
    await getLeadItem(id);
  };

  const handleVerify = () => {
    if (pass_verify) return;
    if (cargoAction.stage === WAYPOINT_TYPES.loading) {
      handleVerifyCargoLoad();
    } else {
      handleVerifyCargoUnload();
    }
  };

  const handleReject = () => {
    if (pass_verify) return;
    if (cargoAction.stage === WAYPOINT_TYPES.loading) {
      handleRejectCargoLoad();
    } else {
      handleRejectCargoUnload();
    }
  };

  return (
    <Section
      icon={
        isVerified ? (
          <TaskAltOutlinedIcon color="success" />
        ) : (
          <NewReleasesIcon color="primary" />
        )
      }
      title={title}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {cargoAction?.files?.map((file) => (
          <LeadDocumentCard document={file} onOpen={setCurrentFile} />
        ))}

        <FileModal currentFile={currentFile} setCurrentFile={setCurrentFile} />
      </Box>
      {!isVerified && !pass_verify && (
        <Box
          sx={{
            my: 1,
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            disabled={isLoadLoading || isUnloadLoading}
            color="success"
            variant="outlined"
            onClick={handleVerify}
          >
            {isLoadLoading || isUnloadLoading
              ? t("ui.confirmation_in_progress_2")
              : t("ui.confirm")}
          </Button>
          <Button
            disabled={isLoadLoading || isUnloadLoading}
            color="error"
            variant="outlined"
            onClick={handleReject}
          >{t("ui.reject")}</Button>
        </Box>
      )}
    </Section>
  );
};

export default CargosVerificationContainer;
