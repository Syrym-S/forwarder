import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import Section from "../leads/lead-item/lead-detail-section";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import InfoItem from "../../shared/ui/info-item";

const FactoringFinancialInfo = ({ factoring }) => {
  const { t } = useTranslation();
  return (
    <Section
      title={t("ui.funds_details")}
      icon={<CurrencyExchangeOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <InfoItem
          label={t("ui.debt")}
          value={`${moneySpacingFormat(factoring?.deb_summ)} ${factoring?.deb_currency}`}
        />
        <InfoItem
          label={t("ui.debt_payment")}
          value={`${moneySpacingFormat(factoring?.cred_summ)} ${factoring?.currency}`}
        />
        <InfoItem
          label={t("ui.factor_percentage")}
          value={`${(factoring?.proc_factor * 100).toFixed(1)}%`}
        />
        <InfoItem
          label={t("ui.service_percentage")}
          value={`${(factoring?.proc_service * 100).toFixed(1)}%`}
        />
      </Box>
    </Section>
  );
};

export default FactoringFinancialInfo;
