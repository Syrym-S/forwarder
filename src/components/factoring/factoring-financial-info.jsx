import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import Section from "../../shared/ui/section";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import InfoItem from "../../shared/ui/info-item";

const FactoringFinancialInfo = ({ factoring }) => {
  return (
    <Section
      title="Данные и денежных средств"
      icon={<CurrencyExchangeOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(4, 1fr)",
          },
          gap: {
            xs: 1,
            sm: 3,
          },
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
