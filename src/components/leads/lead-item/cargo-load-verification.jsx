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

const CargoLoadVerification = ({
  filesFromDriver,
  isVerified,
  handleVerifyCargo,
  handleRejectCargo,
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const isLoading = useLeadsStore((state) => state.isLoading);

  return (
    <Section
      icon={
        isVerified ? (
          <TaskAltOutlinedIcon color="success" />
        ) : (
          <NewReleasesIcon color="primary" />
        )
      }
      title={isVerified ? "Погрузка подтверждена" : "Подтверждение погрузки"}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 5,
        }}
      >
        {filesFromDriver?.map((file) => (
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
            disabled={isLoading}
            color="success"
            variant="outlined"
            onClick={handleVerifyCargo}
          >
            Подтвердить
          </Button>
          <Button
            disabled={isLoading}
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
