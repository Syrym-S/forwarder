import { useTranslation } from "react-i18next";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";

const FactorDataTable = ({ factor }) => {
  const { t } = useTranslation();
  const rows = [
    {
      label: t("ui.full_name"),
      value: factor?.fio,
    },
    {
      label: "Email",
      value: factor?.email,
    },
    {
      label: t("ui.iin"),
      value: factor?.iin,
    },
    {
      label: t("ui.number"),
      value: factor?.phone,
    },
    {
      label: t("ui.company"),
      value: factor?.company_name,
    },
    {
      label: t("ui.bin"),
      value: factor?.bin || factor?.company_bin,
    },
    {
      label: t("ui.company_address"),
      value: factor?.company_address,
    },
  ];

  return (
    <TableContainer component={Box}>
      <Table size="small">
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>{row.label}:</TableCell>
              <TableCell>{row.value || t("ui.not_specified")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FactorDataTable;
