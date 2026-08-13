import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { renderLineColor } from "../../helpers/factoring/render-progress-line-color";

const useFactoringLineColumns = () => {
  return [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => {
        return (
          <NavLink
            to={`/factoring-lines/${row.id}/${row.factor.company_bin}-${row.factor.company_name}`}
            style={{
              textDecoration: "none",
            }}
          >
            {row.id}
          </NavLink>
        );
      },
    },
    {
      field: "status",
      headerName: "Статус",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => <RenderStatus status={row.status} />,
    },
    {
      field: "factor",
      headerName: "Фактор",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
              }}
            >
              {row.factor.company_name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7em",
                сolor: "divider",
                fontWeight: 300,
              }}
            >
              БИН: {row.factor.company_bin}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                сolor: "divider",
                fontWeight: 300,
              }}
            >
              {row.factor.fio}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                сolor: "divider",
                fontWeight: 300,
              }}
            >
              {row.factor.phone}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "summ_current",
      headerName: "Текущая сумма",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "progress",
      headerName: "Прогресс",
      flex: 1,
      minWidth: 300,
      renderCell: ({ row }) => {
        const usedPercent =
          row.summ_max > 0
            ? Math.round((row.summ_current / row.summ_max) * 100)
            : 0;

        return (
          <Stack
            spacing={0.5}
            sx={{
              py: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Использовано
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {usedPercent}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={usedPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: renderLineColor(usedPercent),
                  borderRadius: 4,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: "summ_max",
      headerName: "Максимальная сумма",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "currency",
      headerName: "Валюта",
      width: 100,
    },
    {
      field: "period_start",
      headerName: "Дата начала",
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) =>
        new Date(value.date).toLocaleDateString("ru-RU"),
    },
    {
      field: "period_end",
      headerName: "Дата окончания",
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) =>
        new Date(value.date).toLocaleDateString("ru-RU"),
    },
    {
      field: "salesRelations",
      headerName: "Связи продаж",
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.salesRelations?.length ?? 0,
    },
  ];
};

export default useFactoringLineColumns;
