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
  const rows = [
    {
      label: "ФИО",
      value: factor?.fio,
    },
    {
      label: "Email",
      value: factor?.email,
    },
    {
      label: "ИИН",
      value: factor?.iin,
    },
    {
      label: "Номер",
      value: factor?.phone,
    },
    {
      label: "Компания",
      value: factor?.company_name,
    },
    {
      label: "БИН",
      value: factor?.bin || factor?.company_bin,
    },
    {
      label: "Адрес компании",
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
              <TableCell>{row.value || "Не указан"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FactorDataTable;
