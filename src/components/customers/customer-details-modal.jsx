import {
  Box,
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
import { useCustomerStore } from "../../app/store/customer";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";
import Loader from "../layout/loader";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const CustomerDetailsModal = ({ selectedCustomer, handleClear }) => {
  const customerDetails = useCustomerStore((state) => state.customerDetails);
  const isLoading = useCustomerStore((state) => state.isLoading);

  if (!customerDetails || isLoading) return <Loader />;

  return (
    <Dialog
      open={!!selectedCustomer}
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
            Заказщик
          </Typography>
          <Typography
            sx={{
              fontSize: "1.3rem",
            }}
          >
            {selectedCustomer?.name}
          </Typography>
        </Stack>

        <Tooltip title="Закрыть">
          <HighlightOffOutlinedIcon color="error" onClick={handleClear} />
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <Section
          icon={<AirportShuttleOutlinedIcon color="primary" />}
          title="Представитель заказщика"
        >
          {customerDetails.persons[0] ? (
            <Stack
              sx={{
                gap: "10px",
              }}
            >
              <InfoField label="ФИО" value={customerDetails.persons[0]?.fio} />
              <InfoField label="ИИН" value={customerDetails.persons[0]?.iin} />
              <InfoField
                label="Номер телефона"
                value={customerDetails.persons[0]?.phone}
              />
            </Stack>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>Представитель не указан</Typography>
            </Box>
          )}
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
