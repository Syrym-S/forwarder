import React, { useState } from "react";
import Section from "../../../shared/ui/section";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, Button, Typography } from "@mui/material";
import LeadFilePreview from "./lead-file-preview";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { LeadDocumentCard } from "../documents/LeadDocumentCard";
import FileModal from "../../tenders/file-modal";
import { STATUS } from "../../../shared/const/tenders";

const CargoLoadVerification = ({
  leadStatus,
  filesFromDriverToLoad,
  isLoadingVerified,
  handleVerifyCargo,
  handleRejectCargo,
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const isLoadLoading = useLeadsStore((state) => state.isLoadLoading);

  return (
    <Section
      icon={
        isLoadingVerified ? (
          <TaskAltOutlinedIcon color="success" />
        ) : (
          <NewReleasesIcon color="primary" />
        )
      }
      title={
        isLoadingVerified ? "Погрузка подтверждена" : "Подтверждение погрузки"
      }
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
        {filesFromDriverToLoad?.map((file) => (
          <LeadDocumentCard document={file} onOpen={setCurrentFile} />
        ))}

        <FileModal currentFile={currentFile} setCurrentFile={setCurrentFile} />
      </Box>
      {!isLoadingVerified && (
        <Box
          sx={{
            my: 1,
            display: "flex",
            gap: 5,
          }}
        >
          <Button
            disabled={isLoadLoading || leadStatus !== STATUS.start_loading}
            color="success"
            variant="outlined"
            onClick={handleVerifyCargo}
          >
            {isLoadLoading ? "Идет подтверждение" : "Подтвердить"}
          </Button>
          <Button
            disabled={isLoadLoading || leadStatus !== STATUS.start_loading}
            color="error"
            variant="outlined"
            onClick={handleRejectCargo}
          >
            Отклонить
          </Button>
        </Box>
      )}
    </Section>
  );
};

export default CargoLoadVerification;
