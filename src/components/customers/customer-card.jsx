import { useTranslation } from "react-i18next";
import { Box, Chip, Stack, Typography } from "@mui/material";
import InfoItem from "../../shared/ui/info-item";

const CustomerCard = ({ customer, setSelectedCustomer }) => {
  const { t } = useTranslation();
  const handleSetCustomerDetails = () => {
    setSelectedCustomer(customer);
  };

  return (
    <Box
      tabIndex={0}
      onClick={handleSetCustomerDetails}
      sx={{
        p: { xs: 2, sm: 3 },
        minWidth: 0,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "& .MuiTypography-root": { overflowWrap: "anywhere" },
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
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Stack sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.75, display: "flex", alignItems: "center" }}
          >{t("ui.customer")}</Typography>

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
          sx={{ flexShrink: 0 }}
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
        <InfoItem label="BIN" value={customer?.bin} />
        <InfoItem label={t("ui.customer_addresses")} value={customer?.legal_address} />
      </Box>
    </Box>
  );
};

export default CustomerCard;
