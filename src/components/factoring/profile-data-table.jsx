import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useProfileStore } from "../../app/store/profile/profile-store";

const ProfileDataTable = () => {
  const { t } = useTranslation();
  const profileData = useProfileStore((state) => state.profileData);

  const rows = [
    {
      label: t("ui.full_name"),
      value: profileData?.personFio,
    },
    {
      label: "Email",
      value: profileData?.personEmail,
    },
    {
      label: t("ui.iin"),
      value: profileData?.personIin,
    },
    {
      label: t("ui.number"),
      value: profileData?.personPhone,
    },
    {
      label: t("ui.company"),
      value: profileData?.companyName,
    },
    {
      label: t("ui.bin"),
      value: profileData?.companyBin,
    },
    {
      label: t("ui.company_address"),
      value: profileData?.companyAddress,
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

export default ProfileDataTable;
