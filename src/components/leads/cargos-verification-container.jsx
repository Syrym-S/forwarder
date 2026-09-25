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
    title = "Погрузка подтверждена";
  } else if (stage === WAYPOINT_TYPES.loading && !isVerified) {
    title = "Подтверждение погрузки";
  } else if (stage === WAYPOINT_TYPES.unloading && isVerified) {
    title = "Разгрузка подтверждена";
  } else if (stage === WAYPOINT_TYPES.unloading && !isVerified) {
    title = "Подтверждение разгрузки";
  }

  return title;
};

const CargosVerificationContainer = ({ cargoAction, passVerify = false }) => {
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
  const title = passVerify
    ? (cargoAction.stage === WAYPOINT_TYPES.loading ? "Погрузка — без подтверждения" : "Разгрузка — без подтверждения")
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
    if (passVerify) return;
    if (cargoAction.stage === WAYPOINT_TYPES.loading) {
      handleVerifyCargoLoad();
    } else {
      handleVerifyCargoUnload();
    }
  };

  const handleReject = () => {
    if (passVerify) return;
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
      {!isVerified && !passVerify && (
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
              ? "Идет подтверждение"
              : "Подтвердить"}
          </Button>
          <Button
            disabled={isLoadLoading || isUnloadLoading}
            color="error"
            variant="outlined"
            onClick={handleReject}
          >
            Отклонить
          </Button>
        </Box>
      )}
    </Section>
  );
};

export default CargosVerificationContainer;
