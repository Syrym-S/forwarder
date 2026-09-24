import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { useEffect, useState } from "react";
import CustomerTenderItem from "./customer-tender-item";

const CustomerCreatedTenders = () => {
  const tenders = useTendersStore((state) => state.customerTenders);
  const publicTenders = tenders.filter(
    (tender) => tender.publication_type === "private",
  );
  const privateTenders = tenders.filter(
    (tender) => tender.publication_type === "public",
  );
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const isLoading = useTendersStore((state) => state.isLoading);

  const [checked, setChecked] = useState(false);

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
          Аукционы заказчиков
        </Typography>

        <Tooltip
          title={
            checked ? "Показать только публичные" : "Показать только приватные"
          }
        >
          <Switch
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
        </Tooltip>
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
              Список приватных аукционов от заказчиков пуст!
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
              Список публичных аукционов от заказчиков пуст!
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
