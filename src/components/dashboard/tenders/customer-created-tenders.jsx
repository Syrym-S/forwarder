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
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const isLoading = useTendersStore((state) => state.isLoading);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const isEmpty = tenders.length === 0;

  useEffect(() => {
    getCustomerTenders();
  }, []);

  if (isLoading)
    return (
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    );

  return (
    <Paper
      sx={{
        height: "100%",
        px: 2,
        pb: 2,
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 1,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
          }}
        >
          Список тендеров от Заказщиков
        </Typography>

        <Tooltip
          title={
            checked
              ? "Показать только публичные: ВЫКЛ"
              : "Показать только публичные: ВКЛ"
          }
        >
          <Switch onChange={handleChange} />
        </Tooltip>
      </Box>

      {isEmpty && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            height: "30vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Alert severity="info">Список тендеров от заказщиков пуст!</Alert>
          </Box>
        </Box>
      )}

      {!isEmpty && (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          {checked
            ? tenders
                .filter((tender) => tender.publication_type === "public")
                .map((tender) => <CustomerTenderItem tender={tender} />)
            : tenders.map((tender) => <CustomerTenderItem tender={tender} />)}
        </Box>
      )}
    </Paper>
  );
};

export default CustomerCreatedTenders;
