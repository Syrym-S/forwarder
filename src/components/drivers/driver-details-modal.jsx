import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";
import Loader from "../layout/loader";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useDriverStore } from "../../app/store/drivers/driver-store";

const DriverDetailsModal = ({ selectedDriver, handleClear }) => {
  const driverDetails = useDriverStore((state) => state.driverDetails);
  const isLoading = useDriverStore((state) => state.isLoading);

  if (!driverDetails || isLoading) return <Loader />;

  return (
    <Dialog
      open={!!selectedDriver}
      onClose={handleClear}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography
            sx={{
              fontSize: "1rem",
            }}
          >
            Водитель
          </Typography>
          <Typography
            sx={{
              fontSize: "1.3rem",
            }}
          >
            {driverDetails?.fio}
          </Typography>
        </Stack>

        <Tooltip title="Закрыть">
          <HighlightOffOutlinedIcon color="error" onClick={handleClear} />
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <Section
          icon={<AirportShuttleOutlinedIcon color="primary" />}
          title="Информация о водителе"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: {
                xs: 1,
                sm: 3,
              },
            }}
          >
            <InfoField
              label={"Верификаци документов"}
              value={
                <Chip
                  variant="outlined"
                  label={
                    driverDetails?.documents_verified
                      ? "Документы прошли проверку"
                      : "Документы не прошли проверку"
                  }
                  color={
                    driverDetails?.documents_verified ? "success" : "error"
                  }
                />
              }
            />

            <InfoField
              label={"Статус резидентства"}
              value={
                driverDetails?.is_foreigner ? "Иностранец" : "Гражданин страны"
              }
            />

            <InfoField
              label={"Занятость"}
              value={driverDetails?.is_ip ? "ИП" : "Не ИП"}
            />

            <InfoField
              label={"Доверенность"}
              value={
                driverDetails?.trusted
                  ? "Доверенное лицо"
                  : "Не указан как доверенное лицо"
              }
            />

            <InfoField label={"ИИН"} value={driverDetails?.iin} />

            <InfoField label={"Номер телефона"} value={driverDetails?.phone} />
          </Box>
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default DriverDetailsModal;
