import { useTranslation } from "react-i18next";
import Section from "./tender-section";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoItem from "../../shared/ui/info-item";
import { Box } from "@mui/material";

const TenderInfo = ({ tender }) => {
  const { t } = useTranslation();
  return (
    <Section
      title={t("ui.auction_information")}
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
        <InfoItem label={t("ui.target_audience")} value={"-"} />

        <InfoItem
          label={t("ui.publication_type")}
          value={
            tender?.publication_type === "public" ? t("ui.public") : t("ui.private")
          }
        />

        <InfoItem
          label={t("ui.maximum_participants")}
          value={tender?.max_participants_count}
        />
        <InfoItem label={t("ui.participants")} value={tender?.participants_count} />
      </Box>
    </Section>
  );
};

export default TenderInfo;
