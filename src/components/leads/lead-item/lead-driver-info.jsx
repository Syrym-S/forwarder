import React from "react";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Box, Button, CircularProgress } from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";

const LeadDriverInfo = ({ leadData }) => {
  const driver = leadData?.driver;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;

  const detachDriver = useLeadsStore((state) => state.detachDriver);
  const isDriverDetachLoading = useLeadsStore(
    (state) => state.isDriverDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const handleDetachDriver = async () => {
    await detachDriver(leadData?.id);
    await getLeadItem(leadData?.id);
  };

  if (isDriverDetachLoading)
    return (
      <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      </Section>
    );

  if (!driver.fio && !driver.id)
    return (
      <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
        <InfoField label={""} value={"Водитель не указан"} />
      </Section>
    );

  return (
    <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
      {isAddDriverStatus && (
        <Button color="error" variant="outlined" onClick={handleDetachDriver}>
          Отвязать водителя
        </Button>
      )}
      <Box
        sx={{
          py: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3,1fr)",
          },
          gap: 3,
        }}
      >
        <InfoField label={"ID водителя"} value={driver.id} />
        <InfoField label={"ФИО"} value={driver.fio} />
        <InfoField label={"Номер телефона"} value={driver.phone} />
      </Box>
    </Section>
  );
};

export default LeadDriverInfo;
