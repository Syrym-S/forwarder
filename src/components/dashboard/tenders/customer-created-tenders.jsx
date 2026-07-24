import {
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
        px: 2,
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

        <Tooltip title="Показать только публичные">
          <Switch onChange={handleChange} />
        </Tooltip>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {checked
          ? tenders
              .filter((tender) => tender.publication_type === "public")
              .map((tender) => <CustomerTenderItem tender={tender} />)
          : tenders.map((tender) => <CustomerTenderItem tender={tender} />)}
      </Box>
    </Paper>
  );
};

export default CustomerCreatedTenders;
