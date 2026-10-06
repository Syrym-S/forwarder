import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import ForwarderTenderItem from "./forwarder-tender-item";

const ForwarderCreatedTenders = () => {
  const tenders = useTendersStore((state) => state.tenders);
  const getTenders = useTendersStore((state) => state.getTenders);
  const isLoading = useTendersStore((state) => state.isLoading);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const publicTenders = tenders.filter(
    (tender) => tender.publication_type === "public",
  );

  const privateTenders = tenders.filter(
    (tender) => tender.publication_type === "private",
  );

  const isPrivateTendersEmpty = privateTenders.length === 0;
  const isPublicTendersEmpty = publicTenders.length === 0;

  useEffect(() => {
    getTenders();
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
          Аукционы для водителей
        </Typography>

        <FormControlLabel
          sx={{ m: 0, gap: 0.5 }}
          label={checked ? "Публичные аукционы" : "Приватные аукцоны"}
          slotProps={{ typography: { fontSize: 13, color: "text.secondary" } }}
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              slotProps={{
                input: { "aria-label": "???????? ????????? ????????" },
              }}
            />
          }
        />
      </Box>

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
            <Alert severity="info">Список аукционов для водителей пуст!</Alert>
          </Box>
        </Box>
      )}

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
            <Alert severity="info">Нет публичных аукционов!</Alert>
          </Box>
        </Box>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {checked
          ? publicTenders.map((tender) => (
              <ForwarderTenderItem key={tender.id} tender={tender} />
            ))
          : privateTenders.map((tender) => (
              <ForwarderTenderItem key={tender.id} tender={tender} />
            ))}
      </Box>
    </Paper>
  );
};

export default ForwarderCreatedTenders;
