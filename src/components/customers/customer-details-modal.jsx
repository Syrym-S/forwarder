import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import Tooltip from "../../shared/ui/action-tooltip";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Section from "../../shared/ui/section";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import dayjs from "dayjs";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import ModalLoader from "../../shared/ui/loaders/modal-loader";
import InfoItem from "../../shared/ui/info-item";

const companyFields = () => [
  ["name", appI18n.t("ui.company_name")],
  ["bin", appI18n.t("ui.bin")],
  ["type", appI18n.t("ui.organization_type")],
  ["legal_address", appI18n.t("ui.registered_address")],
  ["bik", appI18n.t("ui.bic")],
  ["account_number", appI18n.t("ui.current_account")],
  ["bank_name", appI18n.t("ui.bank")],
];

const personFields = () => [
  ["fio", appI18n.t("ui.full_name")],
  ["iin", appI18n.t("ui.iin")],
  ["phone", appI18n.t("ui.phone")],
  ["email", "Email"],
  ["document_number", appI18n.t("ui.document_number")],
  ["issue_country", appI18n.t("ui.document_issuing_country")],
  ["document_issue_date", appI18n.t("ui.document_issue_date")],
  ["document_issued_by", appI18n.t("ui.document_issued_by")],
];

const infoGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5,
  "& .MuiTypography-root": { overflowWrap: "anywhere" },
};

const CustomerDetailsModal = ({ selectedCustomer, handleClear }) => {
  const { t } = useTranslation();
  const customerDetails = useCustomerStore((state) => state.customerDetails);
  const isDetailsLoading = useCustomerStore((state) => state.isDetailsLoading);

  if (!customerDetails || isDetailsLoading)
    return (
      <Dialog
        open={!!selectedCustomer}
        onClose={handleClear}
        maxWidth="md"
        fullWidth
      >
        <ModalLoader />
      </Dialog>
    );

  return (
    <Dialog
      open={!!selectedCustomer}
      onClose={handleClear}
      maxWidth="md"
      fullWidth
      aria-labelledby="customer-details-title"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography
            id="customer-details-title"
            component="h2"
            sx={{
              fontSize: "1rem",
            }}
          >{t("ui.customer")}</Typography>
          <Typography
            sx={{
              fontSize: "1.3rem",
            }}
          >
            {customerDetails.name || selectedCustomer?.name}
          </Typography>
        </Stack>

        <Tooltip title={t("ui.close")}>
          <IconButton
            aria-label={t("ui.close_customer_details")}
            onClick={handleClear}
            sx={{ p: 0 }}
          >
            <HighlightOffOutlinedIcon color="error" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent
        sx={{ bgcolor: "background.default", p: { xs: 2, sm: 3 } }}
      >
        <Section
          icon={<BusinessOutlinedIcon color="primary" />}
          title={t("ui.customer_company_details")}
        >
          <Box sx={infoGridSx}>
            {companyFields().map(([key, label]) => (
              <InfoItem
                key={key}
                label={label}
                value={customerDetails[key] || null}
              />
            ))}
          </Box>
        </Section>

        {customerDetails.persons?.length ? (
          customerDetails.persons.map((person, index) => (
            <Section
              key={index}
              icon={<PersonOutlineRoundedIcon color="primary" />}
              title={t("ui.contact_person_details_number", { value1: customerDetails.persons.length > 1 ? ` №${index + 1}` : "" })}
            >
              <Box sx={infoGridSx}>
                {personFields().map(([key, label]) => {
                  const value = person[key];
                  const displayValue =
                    key === "document_issue_date" &&
                    value &&
                    dayjs(value).isValid()
                      ? dayjs(value).format("DD.MM.YYYY")
                      : value;

                  return (
                    <InfoItem
                      key={key}
                      label={label}
                      value={displayValue || null}
                    />
                  );
                })}
              </Box>
            </Section>
          ))
        ) : (
          <Section
            icon={<PersonOutlineRoundedIcon color="primary" />}
            title={t("ui.contact_person_details")}
          >
            <Typography color="text.secondary">{t("ui.contact_person_not_specified")}</Typography>
          </Section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
