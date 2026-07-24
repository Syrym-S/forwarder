import {
  Box,
  CircularProgress,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import CustomerTenderItem from "./customer-tender-item";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import ForwarderTenderItem from "./forwarder-tender-item";

const ForwarderCreatedTenders = () => {
  const tenders = useTendersStore((state) => state.tenders);
  const getTenders = useTendersStore((state) => state.getTenders);
  const isLoading = useTendersStore((state) => state.isLoading);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    getTenders();
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
          Список тендеров для водителей
        </Typography>

        <Tooltip title="Показать только публичные">
          <Switch onChange={handleChange} />
        </Tooltip>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {checked
          ? tenders
              .filter((tender) => tender.publication_type === "public")
              .map((tender) => <ForwarderTenderItem tender={tender} />)
          : tenders.map((tender) => <ForwarderTenderItem tender={tender} />)}
      </Box>
    </Paper>
  );
};

export default ForwarderCreatedTenders;
