import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const rows = [
    {
      label: t("ui.full_name"),
      value: customer?.fullname,
    },
    {
      label: t("ui.bin"),
      value: customer?.bin || customer?.company_bin,
    },
    {
      label: t("ui.confirmation"),
      value: (
        <Chip
          label={
            verified_customer ? t("ui.customer_confirmed") : t("ui.customer_not_confirmed")
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
              <TableCell>{row.value || t("ui.not_specified")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerDataTable;
