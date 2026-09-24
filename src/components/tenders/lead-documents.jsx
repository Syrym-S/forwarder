import { useEffect, useState } from "react";
import Section from "./tender-section";
import { LeadDocumentCard } from "../leads/documents/LeadDocumentCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, CircularProgress } from "@mui/material";
import FileModal from "./file-modal";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const LeadDocuments = ({ tender }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const files = useLeadsStore((state) => state.files);

  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);

  const isEmpty = files.length === 0;

  useEffect(() => {
    if (tender?.lead?.id) {
      getLeadFiles(tender?.lead?.id);
    }
  }, [tender?.lead?.id]);

  if (!files)
    return (
      <Section
        title="Документы перевозки"
        icon={<DescriptionOutlinedIcon color="primary" />}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      </Section>
    );

  return (
    <Section
      title="Документы перевозки"
      icon={<DescriptionOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {isEmpty && "Cписок пуст"}
        {!isEmpty &&
          files.map((file) => (
            <LeadDocumentCard
              isFileReadOnly
              key={file.path}
              document={file}
              onOpen={setCurrentFile}
            />
          ))}
      </Box>
      <FileModal currentFile={currentFile} setCurrentFile={setCurrentFile} />
    </Section>
  );
};

export default LeadDocuments;
