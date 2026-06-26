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
      value: factor?.personEmail,
    },
    {
      label: "ИИН",
      value: factor?.personIin,
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
      value: factor?.bin,
    },
    {
      label: "Адрес компании",
      value: factor?.companyAddress,
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
