import React from "react";
import RootLayout from "../layout/root-layout";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import KanbanCard from "./kanban-item-card";

const STATUS_COLUMNS = [
  { id: "new", title: "Новые", color: "#1976d2" },
  { id: "add_driver", title: "Добавлен водитель", color: "#1976d2" },
  { id: "start_driver", title: "Поездка начата", color: "#1976d2" },
  { id: "start_loading", title: "Погрузка", color: "#1976d2" },
  {
    id: "verification_loading",
    title: "Погрузка подтверждена",
    color: "#1976d2",
  },
  { id: "start_unloading", title: "Разгрузка", color: "#1976d2" },
  {
    id: "verification_unloading",
    title: "Разгрузка подтверждена",
    color: "#1976d2",
  },
];

const parseLeadToColumns = (leads) => {
  const columns = STATUS_COLUMNS.map((column) => ({
    ...column,
    items: leads.filter((lead) => lead.status === column.id),
  }));

  return columns;
};

const LeadKanbanTable = ({ leads }) => {
  const columns = parseLeadToColumns(leads);

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        overflowX: "auto",
        py: 3,
      }}
    >
      {columns.map((column) => (
        <Box
          key={column.id}
          sx={{
            width: 400,
            minWidth: 400,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                border: "1px solid #bfbcbc",
                width: "100%",
                p: 2,
                m: 1,
                borderRadius: 3,
              }}
            >
              <Typography fontWeight={700}>{column.title}</Typography>
              <Chip
                label={column.items.length}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Stack>

          <Box
            sx={{
              overflowY: "auto",
              pt: 1,
              px: 0.5,
            }}
          >
            {column.items.map((item) => (
              <KanbanCard key={item.id} item={item} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LeadKanbanTable;
