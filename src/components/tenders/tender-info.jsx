import Section from "../../shared/ui/section";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoItem from "../../shared/ui/info-item";
import { Box } from "@mui/material";

const TenderInfo = ({ tender }) => {
  return (
    <Section
      title="Информация о аукционе"
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
