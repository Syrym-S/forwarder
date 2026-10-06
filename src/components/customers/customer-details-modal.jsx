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

const companyFields = [
  ["name", "Название компании"],
  ["bin", "БИН"],
  ["type", "Тип организации"],
  ["legal_address", "Юридический адрес"],
  ["bik", "БИК"],
  ["account_number", "Расчётный счёт"],
  ["bank_name", "Банк"],
];

const personFields = [
  ["fio", "ФИО"],
  ["iin", "ИИН"],
  ["phone", "Номер телефона"],
  ["email", "Email"],
  ["document_number", "Номер документа"],
  ["issue_country", "Страна выдачи документа"],
  ["document_issue_date", "Дата выдачи документа"],
  ["document_issued_by", "Кем выдан документ"],
];

const infoGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5,
  "& .MuiTypography-root": { overflowWrap: "anywhere" },
};

const CustomerDetailsModal = ({ selectedCustomer, handleClear }) => {
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
          >
            Заказчик
          </Typography>
          <Typography
            sx={{
              fontSize: "1.3rem",
            }}
          >
            {customerDetails.name || selectedCustomer?.name}
          </Typography>
        </Stack>

        <Tooltip title="Закрыть">
          <IconButton aria-label="Закрыть данные заказчика" onClick={handleClear} sx={{ p: 0 }}>
            <HighlightOffOutlinedIcon color="error" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "background.default", p: { xs: 2, sm: 3 } }}>
        <Section
          icon={<BusinessOutlinedIcon color="primary" />}
          title="Данные заказчика — компания"
        >
          <Box sx={infoGridSx}>
            {companyFields.map(([key, label]) => (
              <InfoItem key={key} label={label} value={customerDetails[key] || null} />
            ))}
          </Box>
        </Section>

        {customerDetails.persons?.length ? (
          customerDetails.persons.map((person, index) => (
            <Section
              key={index}
              icon={<PersonOutlineRoundedIcon color="primary" />}
              title={`Данные контактного лица${customerDetails.persons.length > 1 ? ` №${index + 1}` : ""}`}
            >
              <Box sx={infoGridSx}>
                {personFields.map(([key, label]) => {
                  const value = person[key];
                  const displayValue = key === "document_issue_date" && value && dayjs(value).isValid()
                    ? dayjs(value).format("DD.MM.YYYY")
                    : value;

                  return <InfoItem key={key} label={label} value={displayValue || null} />;
                })}
              </Box>
            </Section>
          ))
        ) : (
          <Section icon={<PersonOutlineRoundedIcon color="primary" />} title="Данные контактного лица">
            <Typography color="text.secondary">Контактное лицо не указано</Typography>
          </Section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
