import React, { useState } from "react";
import Section from "../../shared/ui/section";
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

const CargosVerificationContainer = ({ cargoAction }) => {
  const { id } = useParams();
  const [currentFile, setCurrentFile] = useState(null);

  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const verifyCargoLoad = useLeadsStore((state) => state.verifyCargo);
  const rejectCargoLoad = useLeadsStore((state) => state.rejectCargo);
  const verifyCargoUnload = useLeadsStore((state) => state.verifyCargoUnload);
  const rejectCargoUnload = useLeadsStore((state) => state.rejectCargoUnload);

  const isVerified = cargoAction.is_verified;
  const title = renderTitleText(cargoAction.stage, isVerified);

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
    if (cargoAction.stage === WAYPOINT_TYPES.loading) {
      handleVerifyCargoLoad();
    } else {
      handleVerifyCargoUnload();
    }
  };

  const handleReject = () => {
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
          gap: 5,
        }}
      >
        {cargoAction.files.map((file) => (
          <LeadDocumentCard document={file} onOpen={setCurrentFile} />
        ))}

        <FileModal currentFile={currentFile} setCurrentFile={setCurrentFile} />
      </Box>
      {!isVerified && (
        <Box
          sx={{
            my: 1,
            display: "flex",
            gap: 5,
          }}
        >
          <Button
            // disabled={isLoadLoading || leadStatus !== STATUS.start_loading}
            color="success"
            variant="outlined"
            onClick={handleVerify}
          >
            Подтвердить
            {/* {isLoadLoading ? "Идет подтверждение" : "Подтвердить"} */}
          </Button>
          <Button
            // disabled={isLoadLoading || leadData.status !== STATUS.start_loading}
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
