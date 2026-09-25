import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "./lead-detail-section";
import { Box, CircularProgress } from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";
import { InfoBadge } from "../../lead-form/info-badge";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";

const LeadCustomerInfo = ({ leadData, canDetach = false }) => {
  const customer = leadData?.customer;

  const createdByCustomer = leadData?.created_by === "customer";

  const isNewStatus = leadData?.status === STATUS.new;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;

  const detachCustomer = useLeadsStore((state) => state.detachCustomer);
  const isCustomerDetachLoading = useLeadsStore(
    (state) => state.isCustomerDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const handleDetachCustomer = async () => {
    await detachCustomer(leadData?.id);
    await getLeadItem(leadData?.id);
  };

  if (isCustomerDetachLoading)
    return (
      <Section
        title="Данные о заказчике"
        icon={<BusinessOutlinedIcon color="primary" />}
      >
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

  if (!customer?.name)
    return (
      <Section
        title="Данные о заказчике"
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <InfoBadge label={""} value={"Заказчик не указан"} />
      </Section>
    );

  return (
    <Section
      title="Данные о заказчике"
      icon={<BusinessOutlinedIcon color="primary" />}
    >
      {(isAddDriverStatus || isNewStatus) && canDetach && (
        <PrimaryButton
          color="error"
          disabled={createdByCustomer}
          variant="outlined"
          onClick={handleDetachCustomer}
          text={"Отвязать заказчика"}
        />
      )}
      <Box
        sx={{
          py: 1,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <InfoItem label={"Имя"} value={customer.name} />
        <InfoItem label={"Номер телефона"} value={customer.tel} />
        <InfoItem label={"БИН"} value={customer.bin} />
        <InfoItem label={"Контактное лицо"} value={customer.contact_person} />
      </Box>
    </Section>
  );
};

export default LeadCustomerInfo;
