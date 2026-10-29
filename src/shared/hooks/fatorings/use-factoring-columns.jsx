import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import RenderStatus, { RenderStatusContent } from "../../ui/render-status";
import dayjs from "dayjs";
import CustomNavLink from "../../ui/custom-nav-link";
import { moneySpacingFormat } from "../../helpers/money-spacing";

const useFactoringColumns = () => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "id",
      headerName: "№",
      width: 200,
      renderCell: ({ row }) => (
        <CustomNavLink label={row?.id} path={`/factoring/${row?.id}`} />
      ),
    },
    {
      field: "status",
      headerName: t("dashboard.status"),
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatus status={row.status} />
        </Box>
      ),
    },
    {
      field: "lead_id",
      headerName: t("dashboard.lead_id"),
      width: 200,
    },
    {
      field: "factor",
      valueGetter: (_, row) => row?.factor?.company_name || "",
      headerName: t("dashboard.factor"),
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
              {t("dashboard.bin")}: {row.factor.bin}
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
      field: "created_at",
      type: "date",
      valueGetter: (_, row) => {
        const date = row?.created_at?.date;
        return date && dayjs(date).isValid() ? dayjs(date).toDate() : null;
      },
      headerName: t("dashboard.created"),
      width: 200,
      renderCell: ({ row }) => {
        return <Box>{dayjs(row?.created_at?.date).format("DD-MM-YYYY")}</Box>;
      },
    },
    {
      field: "deb_summ",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("dashboard.debt"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>
          {moneySpacingFormat(row?.deb_summ)} {row?.deb_currency}
        </Box>
      ),
    },
    {
      field: "cred_summ",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("dashboard.debt_payment"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>
          {moneySpacingFormat(row?.cred_summ)} {row?.currency}
        </Box>
      ),
    },
    {
      field: "proc_factor",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("dashboard.percentage_from_factor"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>{(row?.proc_factor * 100).toFixed(1)} %</Box>
      ),
    },
    {
      field: "proc_service",
      type: "number",
      valueGetter: (value) =>
        value == null || value === "" ? null : Number(value),
      headerName: t("dashboard.percentage_from_service"),
      width: 200,
      renderCell: ({ row }) => (
        <Box>{(row?.proc_service * 100).toFixed(1)} %</Box>
      ),
    },
    {
      field: "verified_customer",
      headerName: t("dashboard.confirmation_from_customer"),
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatusContent
            label={row?.verified_customer ? t("dashboard.confirmed") : t("dashboard.pending")}
            color={row?.verified_customer ? "#51d861" : "#e9821b"}
          />
        </Box>
      ),
    },
    {
      field: "verified_factor",
      headerName: t("dashboard.confirmation_from_factor"),
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatusContent
            label={row?.verified_factor ? t("dashboard.confirmed") : t("dashboard.pending")}
            color={row?.verified_factor ? "#51d861" : "#e9821b"}
          />
        </Box>
      ),
    },
    {
      field: "verified_forwarder",
      headerName: t("dashboard.confirmation_from_you"),
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RenderStatusContent
            label={row?.verified_forwarder ? t("dashboard.confirmed") : t("dashboard.pending")}
            color={row?.verified_forwarder ? "#51d861" : "#e9821b"}
          />
        </Box>
      ),
    },
  ];

  return columns;
};

export default useFactoringColumns;
