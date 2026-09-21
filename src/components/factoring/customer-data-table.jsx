import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const CustomerDataTable = ({ customer }) => {
  const rows = [
    {
      label: "ФИО",
      value: customer?.fullname,
    },
    {
      label: "Email",
      value: customer?.email,
    },
    {
      label: "ИИН",
      value: customer?.iin,
    },
    {
      label: "Номер",
      value: customer?.phone,
    },
    {
      label: "Компания",
      value: customer?.company_name,
    },
    {
      label: "БИН",
      value: customer?.bin || customer?.company_bin,
    },
    {
      label: "Адрес компании",
      value: customer?.company_address,
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

export default CustomerDataTable;
