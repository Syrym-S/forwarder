import React from "react";
import Section from "../../shared/ui/section";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import InfoField from "../../shared/ui/info-field";
import { Box, Chip } from "@mui/material";

const FactoringCustomerInfo = ({ customer, verified_customer }) => {
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
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <InfoField label={"Имя"} value={customer.fullname} />
        <InfoField label={"ID"} value={customer.id} />
        <InfoField label={"БИН"} value={customer.bin} />
        <InfoField
          label={"Подтверждение"}
          value={
            <Chip
              label={
                verified_customer
                  ? "Заказщик подтвердил"
                  : "Заказщик не подтвердил"
              }
              variant="outlined"
              color={verified_customer ? "success" : "error"}
            />
          }
        />
      </Box>
    </Section>
  );
};

export default FactoringCustomerInfo;
