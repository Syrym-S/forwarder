import { Box } from "@mui/material";
import Section from "../leads/lead-item/lead-detail-section";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import InfoItem from "../../shared/ui/info-item";

const FactoringFinancialInfo = ({ factoring }) => {
  return (
    <Section
      title="Данные о денежных средствах"
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
          label={"Задолженность"}
          value={`${moneySpacingFormat(factoring?.deb_summ)} ${factoring?.deb_currency}`}
        />
        <InfoItem
          label={"Оплата за задолженность"}
          value={`${moneySpacingFormat(factoring?.cred_summ)} ${factoring?.currency}`}
        />
        <InfoItem
          label={"Процент фактора"}
          value={`${(factoring?.proc_factor * 100).toFixed(1)}%`}
        />
        <InfoItem
          label={"Процент сервиса"}
          value={`${(factoring?.proc_service * 100).toFixed(1)}%`}
        />
      </Box>
    </Section>
  );
};

export default FactoringFinancialInfo;
