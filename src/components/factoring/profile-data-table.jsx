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
  const profileData = useProfileStore((state) => state.profileData);

  console.log(profileData);

  const rows = [
    {
      label: "ФИО",
      value: profileData?.personFio,
    },
    {
      label: "Email",
      value: profileData?.personEmail,
    },
    {
      label: "ИИН",
      value: profileData?.personIin,
    },
    {
      label: "Номер",
      value: profileData?.personPhone,
    },
    {
      label: "Компания",
      value: profileData?.companyName,
    },
    {
      label: "БИН",
      value: profileData?.companyBin,
    },
    {
      label: "Адрес компании",
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
              <TableCell>{row.value || "Не указан"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProfileDataTable;
