import React from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import { Box } from "@mui/material";

const LeadCustomerInfo = ({ leadData }) => {
  const customer = leadData?.customer;

  if (!customer)
    return (
      <Section
        title="Данные о заказщике"
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <InfoField label={""} value={"Заказщик не указан"} />
      </Section>
    );

  return (
    <Section
      title="Данные о заказщике"
      icon={<BusinessOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <InfoField label={"Имя"} value={customer.name} />
        <InfoField label={"Номер телефона"} value={customer.tel} />
        <InfoField label={"БИН"} value={customer.bin} />
        <InfoField label={"Контактное лицо"} value={customer.contact_person} />
      </Box>
    </Section>
  );
};

export default LeadCustomerInfo;
