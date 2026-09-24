import Section from "./tender-section";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoItem from "../../shared/ui/info-item";
import { Box } from "@mui/material";

const TenderInfo = ({ tender }) => {
  return (
    <Section
      title="Информация об аукционе"
      icon={<InfoOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 0,
        }}
      >
        <InfoItem label="Для кого" value={"-"} />

        <InfoItem
          label="Тип публикации"
          value={
            tender?.publication_type === "public" ? "Публичный" : "Приватный"
          }
        />

        <InfoItem
          label="Макс. участников"
          value={tender?.max_participants_count}
        />
        <InfoItem label="Участников" value={tender?.participants_count} />
      </Box>
    </Section>
  );
};

export default TenderInfo;
