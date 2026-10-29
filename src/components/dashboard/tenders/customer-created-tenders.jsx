import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { useEffect, useState } from "react";
import CustomerTenderItem from "./customer-tender-item";

const CustomerCreatedTenders = () => {
  const { t } = useTranslation();
  const tenders = useTendersStore((state) => state.customerTenders);
  const publicTenders = tenders.filter(
    (tender) => tender.publication_type === "public",
  );
  const privateTenders = tenders.filter(
    (tender) => tender.publication_type === "private",
  );
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const isLoading = useTendersStore((state) => state.isLoading);

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const isEmpty = tenders.length === 0;
  const isPublicTendersEmpty = publicTenders.length === 0;
  const isPrivateTendersEmpty = privateTenders.length === 0;

  useEffect(() => {
    getCustomerTenders();
  }, []);

  if (isLoading)
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 3,
          minWidth: 0,
          minHeight: 220,
        }}
      >
        <CircularProgress />
      </Paper>
    );

  return (
    <Paper
      className="dashboard-tenders-scroll"
      elevation={0}
      variant="outlined"
      sx={{
        height: "100%",
        px: 2,
        pb: 2,
        overflowY: "auto",
        maxHeight: 480,
        boxSizing: "border-box",
        position: "relative",
        borderRadius: 3,
        minWidth: 0,
        minHeight: 220,
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          zIndex: 1,
          flexWrap: "wrap",
          gap: 1,
          position: "sticky",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 2,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "font_color.heading",
          }}
        >
          {t("dashboard.customer_auctions")}
        </Typography>

        <FormControlLabel
          sx={{ m: 0, gap: 0.5 }}
          label={checked ? t("dashboard.public_auctions") : t("dashboard.private_auctions")}
          slotProps={{ typography: { fontSize: 13, color: "text.secondary" } }}
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "primary.main",
                },

                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  color: "primary.main",
                },
              }}
            />
          }
        />
      </Box>

      {isPublicTendersEmpty && checked && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            minHeight: 160,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Alert severity="info">
              {t("dashboard.no_private_customer_auctions")}
            </Alert>
          </Box>
        </Box>
      )}

      {isPrivateTendersEmpty && !checked && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            minHeight: 160,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Alert severity="info">
              {t("dashboard.no_public_customer_auctions")}
            </Alert>
          </Box>
        </Box>
      )}

      {!isEmpty && (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          {checked
            ? publicTenders.map((tender) => (
                <CustomerTenderItem key={tender.id} tender={tender} />
              ))
            : privateTenders.map((tender) => (
                <CustomerTenderItem key={tender.id} tender={tender} />
              ))}
        </Box>
      )}
    </Paper>
  );
};

export default CustomerCreatedTenders;
