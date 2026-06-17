import React, { useEffect } from "react";
import Section from "../../shared/ui/section";
import { useLeadsStore } from "../../app/store/leads-store";
import { LeadDocumentCard } from "../leads/documents/LeadDocumentCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const LeadDocuments = ({ tender }) => {
  const files = useLeadsStore((state) => state.files);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);

  const isEmpty = files.length === 0;

  useEffect(() => {
    if (tender?.lead?.id) {
      getLeadFiles(tender?.lead?.id);
    }
  }, [tender?.lead?.id]);

  return (
    <Section
      title="Документы лида"
      icon={<DescriptionOutlinedIcon color="primary" />}
    >
      {isEmpty && "Cписок пуст"}
      {!isEmpty &&
        files.map((file) => (
          <LeadDocumentCard key={file.path} document={file} />
        ))}
    </Section>
  );
};

export default LeadDocuments;
