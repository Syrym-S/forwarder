import React, { useState } from "react";
import Section from "../../../shared/ui/section";
import { Box, Button, Typography } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { LeadDocumentCard } from "../documents/LeadDocumentCard";
import FileModal from "../../tenders/file-modal";

const CargoUnloadVerification = ({
  isUnloadVerified,
  filesFromDriverToUnload,
  handleVerifyCargoUnload,
  handleRejectCargoUnload,
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const isLoading = useLeadsStore((state) => state.isLoading);

  return (
    <Section
      icon={
        isUnloadVerified ? (
          <TaskAltOutlinedIcon color="success" />
        ) : (
          <NewReleasesIcon color="primary" />
        )
      }
      title={
        isUnloadVerified ? "Разгрузка подтверждена" : "Подтверждение разгрузки"
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 5,
        }}
      >
        {filesFromDriverToUnload?.map((file) => (
          <LeadDocumentCard document={file} onOpen={setCurrentFile} />
        ))}

        <FileModal currentFile={currentFile} setCurrentFile={setCurrentFile} />
      </Box>
      {!isUnloadVerified && (
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
            onClick={handleVerifyCargoUnload}
          >
            Подтвердить
          </Button>
          <Button
            disabled={isLoading}
            color="error"
            variant="outlined"
            onClick={handleRejectCargoUnload}
          >
            Отклонить
          </Button>
        </Box>
      )}
    </Section>
  );
};

export default CargoUnloadVerification;
