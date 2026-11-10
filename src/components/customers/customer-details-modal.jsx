import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import dayjs from "dayjs";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import InfoItem from "../../shared/ui/info-item";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import CustomerLeads from "./customer-leads";
import CustomerContactValue from "./customer-contact-value";
import CustomerDetailsSkeleton from "./customer-details-skeleton";

const companyFields = [
  ["name", "ui.company_name"],
  ["bin", "ui.bin"],
  ["type", "ui.organization_type"],
  ["legal_address", "ui.registered_address"],
  ["bik", "ui.bic"],
  ["account_number", "ui.current_account"],
];

const personFields = [
  ["fio", "ui.full_name"],
  ["iin", "ui.iin"],
  ["phone", "ui.phone"],
  ["email", null],
  ["document_number", "ui.document_number"],
  ["issue_country", "ui.document_issuing_country"],
  ["document_issue_date", "ui.document_issue_date"],
  ["document_issued_by", "ui.document_issued_by"],
];

const infoGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1,
  "& .MuiTypography-root": { overflowWrap: "anywhere" },
};

const CustomerInfoSection = ({ title, icon, children }) => (
  <Paper component="section" variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      {icon}
      <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const CustomerDetailsModal = ({ selectedCustomer, handleClear }) => {
  const { t } = useTranslation();
  const customerDetails = useCustomerStore((state) => state.customerDetails);
  const isDetailsLoading = useCustomerStore((state) => state.isDetailsLoading);
  const error = useCustomerStore((state) => state.error);
  const isLoading = isDetailsLoading || (!customerDetails && !error);
  const name =
    customerDetails?.name || selectedCustomer?.name || t("ui.customer");
  const persons = Array.isArray(customerDetails?.persons)
    ? customerDetails.persons
    : [];
  const fio = customerDetails?.fio || persons[0]?.fio;
  const leads = Array.isArray(customerDetails?.leads)
    ? customerDetails.leads
    : [];

  return (
    <Dialog
      open={!!selectedCustomer}
      onClose={handleClear}
      maxWidth="lg"
      fullWidth
      aria-label={t("ui.customer")}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            m: { xs: 1.5, sm: 4 },
            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
            height: "min(860px, calc(100dvh - 64px))",
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "calc(100dvh - 64px)" },
          },
        },
      }}
    >
      <TooltipIconButton
        title={t("ui.close")}
        aria-label={t("ui.close_customer_details")}
        onClick={handleClear}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <CloseRoundedIcon />
      </TooltipIconButton>
      {!isLoading && !customerDetails ? (
        <Alert severity="error" sx={{ m: 3, mt: 7 }}>
          {t("dashboard.loading_error")}
        </Alert>
      ) : (
        <DialogContent
          aria-busy={isLoading}
          sx={{
            p: 0,
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "420px minmax(0, 1fr)",
            },
            minHeight: 0,
            overflowY: { xs: "auto", md: "hidden" },
          }}
        >
          {isLoading ? (
            <CustomerDetailsSkeleton />
          ) : (
            <>
              <Box
                component="aside"
                aria-labelledby="customer-details-title"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: { xs: 2, sm: 3 },
                  minWidth: 0,
                  overflowY: { md: "auto" },
                  borderRight: { md: "1px solid" },
                  borderBottom: { xs: "1px solid", md: 0 },
                  borderColor: { xs: "divider", md: "divider" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    pr: { xs: 4, md: 0 },
                  }}
                >
                  <Avatar
                    src={customerDetails.avatar || undefined}
                    alt={name}
                    sx={{
                      width: 72,
                      height: 72,
                      minWidth: 72,
                      minHeight: 72,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      objectFit: "cover",
                    }}
                  >
                    {name.trim().charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography variant="caption" color="text.secondary">
                      {t("ui.customer")}
                    </Typography>
                    <Typography
                      id="customer-details-title"
                      component="h2"
                      sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}
                    >
                      {name}
                    </Typography>
                    {fio && fio !== name && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {fio}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <CustomerInfoSection
                  icon={<BusinessOutlinedIcon color="primary" />}
                  title={t("ui.customer_company_details")}
                >
                  <Box sx={infoGridSx}>
                    {companyFields.map(([key, label]) => (
                      <InfoItem
                        key={key}
                        label={t(label)}
                        value={customerDetails[key] || null}
                      />
                    ))}
                  </Box>
                </CustomerInfoSection>

                {persons.length ? (
                  persons.map((person, index) => (
                    <CustomerInfoSection
                      key={person.id ?? index}
                      icon={<PersonOutlineRoundedIcon color="primary" />}
                      title={t("ui.contact_person_details_number", {
                        value1: persons.length > 1 ? ` №${index + 1}` : "",
                      })}
                    >
                      <Box sx={infoGridSx}>
                        {personFields.map(([key, label]) => {
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
                              label={label ? t(label) : "Email"}
                              value={
                                (key === "phone" || key === "email") &&
                                value ? (
                                  <CustomerContactValue
                                    value={value}
                                    type={key}
                                  />
                                ) : (
                                  displayValue || null
                                )
                              }
                            />
                          );
                        })}
                      </Box>
                    </CustomerInfoSection>
                  ))
                ) : (
                  <CustomerInfoSection
                    icon={<PersonOutlineRoundedIcon color="primary" />}
                    title={t("ui.contact_person_details")}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("ui.contact_person_not_specified")}
                    </Typography>
                  </CustomerInfoSection>
                )}
              </Box>

              <CustomerLeads key={selectedCustomer?.id} leads={leads} />
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CustomerDetailsModal;
