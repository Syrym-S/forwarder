import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import InfoField from "../../shared/ui/info-field";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import InfoItem from "../../shared/ui/info-item";

const CustomerCard = ({ customer, setSelectedCustomer }) => {
  const handleSetCustomerDetails = () => {
    setSelectedCustomer(customer);
  };

  return (
    <Box
      tabIndex={0}
      onClick={handleSetCustomerDetails}
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.75, display: "flex", alignItems: "center" }}
          >
            Заказчик
          </Typography>

          <Typography
            sx={{
              lineHeight: 1.3,
              fontSize: {
                xs: "16px",
                sm: "18px",
              },
              fontWeight: 500,
            }}
          >
            {customer?.name}
          </Typography>
        </Stack>

        <Chip
          label={`ID# ${customer?.id}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          my: 2,
        }}
      >
        <InfoItem label="Банк" value={customer?.bank_name} />
        <InfoItem label="BIN" value={customer?.bin} />
        <InfoItem label="Адресс заказчиков" value={customer?.legal_address} />
      </Box>
    </Box>
  );
};

export default CustomerCard;
