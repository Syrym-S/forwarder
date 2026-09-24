import Section from "./lead-detail-section";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Box, CircularProgress } from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";
import { InfoBadge } from "../../lead-form/info-badge";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";

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
        <InfoBadge label={""} value={"Водитель не указан"} />
      </Section>
    );

  return (
    <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
      {isAddDriverStatus && (
        <PrimaryButton
          color="error"
          variant="outlined"
          onClick={handleDetachDriver}
          text="Отвязать водителя"
        />
      )}
      <Box
        sx={{
          py: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <InfoItem label={"ID водителя"} value={driver.id} />
        <InfoItem label={"ФИО"} value={driver.fio} />
        <InfoItem label={"Номер телефона"} value={driver.phone} />
      </Box>
    </Section>
  );
};

export default LeadDriverInfo;
