import React from "react";
import Section from "../../shared/ui/section";
import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const TenderInfo = ({ tender }) => {
  return (
    <Section
      title="Информация о тендере"
      icon={<InfoOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3,1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <InfoField label="Для кого" value={"-"} />

        <InfoField
          label="Тип публикации"
          value={
            tender?.publication_type === "public" ? "Публичный" : "Приватный"
          }
        />

        <InfoField
          label="Макс. участников"
          value={tender?.max_participants_count}
        />
        <InfoField label="Участников" value={tender?.participants_count} />
      </Box>
    </Section>
  );
};

export default TenderInfo;
