import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const CustomerDataTable = ({ customer, verified_customer }) => {
  const rows = [
    {
      label: "ФИО",
      value: customer?.fullname,
    },
    {
      label: "БИН",
      value: customer?.bin || customer?.company_bin,
    },
    {
      label: "Подтверждение",
      value: (
        <Chip
          label={
            verified_customer ? "Заказчик подтвердил" : "Заказчик не подтвердил"
          }
          variant="outlined"
          color={verified_customer ? "success" : "error"}
        />
      ),
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
