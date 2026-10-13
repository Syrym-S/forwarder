import Tooltip from "../../shared/ui/action-tooltip";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Section from "../../shared/ui/section";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import ModalLoader from "../../shared/ui/loaders/modal-loader";
import InfoItem from "../../shared/ui/info-item";

const infoGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5,
  "& .MuiTypography-root": { overflowWrap: "anywhere" },
};
const booleanLabel = (value, yes, no) =>
  value === true ? yes : value === false ? no : null;

const DriverDetailsModal = ({ selectedDriver, handleClear }) => {
  const driverDetails = useDriverStore((state) => state.driverDetails);
  const isDetailsLoading = useDriverStore((state) => state.isDetailsLoading);

  if (!driverDetails || isDetailsLoading) {
    return (
      <Dialog
        open={!!selectedDriver}
        onClose={handleClear}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <ModalLoader />
      </Dialog>
    );
  }

  return (
    <Dialog
      open={!!selectedDriver}
      onClose={handleClear}
      maxWidth="md"
      fullWidth
      aria-labelledby="driver-details-title"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        component="div"
        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        <Stack sx={{ minWidth: 0 }}>
          <Typography
            id="driver-details-title"
            component="h2"
            sx={{ fontSize: "1rem" }}
          >
            Водитель
          </Typography>
          <Typography sx={{ fontSize: "1.3rem", overflowWrap: "anywhere" }}>
            {driverDetails.fio || selectedDriver?.fio || "ФИО не указано"}
          </Typography>
        </Stack>
        <Tooltip title="Закрыть">
          <IconButton
            aria-label="Закрыть данные водителя"
            onClick={handleClear}
            sx={{ p: 0, alignSelf: "flex-start" }}
          >
            <HighlightOffOutlinedIcon color="error" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent
        sx={{ bgcolor: "background.default", p: { xs: 2, sm: 3 } }}
      >
        <Section
          icon={<PersonOutlineRoundedIcon color="primary" />}
          title="Личные данные водителя"
        >
          <Box sx={infoGridSx}>
            <InfoItem label="ФИО" value={driverDetails.fio || null} />
            <InfoItem label="ИИН" value={driverDetails.iin || null} />
            <InfoItem
              label="Статус резидентства"
              value={booleanLabel(
                driverDetails.is_foreigner,
                "Иностранец",
                "Гражданин страны",
              )}
            />
            <InfoItem label="Рейтинг" value={driverDetails.rating ?? null} />
          </Box>
        </Section>

        <Section
          icon={<ContactPhoneOutlinedIcon color="primary" />}
          title="Контактные данные"
        >
          <Box sx={infoGridSx}>
            <InfoItem
              label="Номер телефона"
              value={driverDetails.phone || null}
            />
            <InfoItem label="Email" value={driverDetails.email || null} />
          </Box>
        </Section>

        <Section
          icon={<BusinessOutlinedIcon color="primary" />}
          title="Данные компании"
        >
          <Box sx={infoGridSx}>
            <InfoItem
              label="Название компании"
              value={driverDetails.company_name || null}
            />
            <InfoItem label="БИН" value={driverDetails.company_bin || null} />
            <InfoItem
              label="Индивидуальный предприниматель"
              value={booleanLabel(driverDetails.is_ip, "Да", "Нет")}
            />
          </Box>
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default DriverDetailsModal;
