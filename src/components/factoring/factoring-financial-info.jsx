import { Box } from "@mui/material";
import InfoField from "../../shared/ui/info-field";
import Section from "../../shared/ui/section";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";

const FactoringFinancialInfo = ({ factoring }) => {
  return (
    <Section
      title="Данные и денежных средств"
      icon={<CurrencyExchangeOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 3,
        }}
      >
        <InfoField
          label={"Задолжность"}
          value={`${factoring?.deb_summ} ${factoring?.deb_currency}`}
        />
        <InfoField
          label={"Оплата за задолжность"}
          value={`${factoring?.cred_summ} ${factoring?.currency}`}
        />
        <InfoField
          label={"Процент фактора"}
          value={`${(factoring?.proc_factor * 100).toFixed(1)}%`}
        />
        <InfoField
          label={"Процент сервиса"}
          value={`${(factoring?.proc_service * 100).toFixed(1)}%`}
        />
      </Box>
    </Section>
  );
};

export default FactoringFinancialInfo;
