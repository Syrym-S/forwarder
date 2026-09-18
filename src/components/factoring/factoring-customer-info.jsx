import React from "react";
import Section from "../../shared/ui/section";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import InfoField from "../../shared/ui/info-field";
import { Box, Chip } from "@mui/material";
import InfoItem from "../../shared/ui/info-item";

const FactoringCustomerInfo = ({ customer, verified_customer }) => {
  if (!customer)
    return (
      <Section
        title="Данные заказчика"
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <InfoField label={""} value={"Заказчик не указан"} />
      </Section>
    );

  return (
    <Section
      title="Данные заказчика"
      icon={<BusinessOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gap: {
            xs: 1,
            sm: 2,
          },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <InfoItem label={"Имя"} value={customer.fullname} />
        <InfoItem label={"ID"} value={customer.id} />
        <InfoItem label={"БИН"} value={customer.bin} />
        <InfoItem
          label={"Подтверждение"}
          value={
            <Chip
              label={
                verified_customer
                  ? "Заказчик подтвердил"
                  : "Заказчик не подтвердил"
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
