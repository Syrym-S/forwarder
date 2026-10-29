import { useTranslation } from "react-i18next";
import React from "react";
import Section from "../../shared/ui/section";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import InfoField from "../../shared/ui/info-field";
import { Box, Chip } from "@mui/material";
import InfoItem from "../../shared/ui/info-item";

const FactoringCustomerInfo = ({ customer, verified_customer }) => {
  const { t } = useTranslation();
  if (!customer)
    return (
      <Section
        title={t("ui.customer_details")}
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <InfoField label={""} value={t("ui.customer_not_specified")} />
      </Section>
    );

  return (
    <Section
      title={t("ui.customer_details")}
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
        <InfoItem label={t("ui.name")} value={customer.fullname} />
        <InfoItem label={"ID"} value={customer.id} />
        <InfoItem label={t("ui.bin")} value={customer.bin} />
        <InfoItem
          label={t("ui.confirmation")}
          value={
            <Chip
              label={
                verified_customer
                  ? t("ui.customer_confirmed")
                  : t("ui.customer_not_confirmed")
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
