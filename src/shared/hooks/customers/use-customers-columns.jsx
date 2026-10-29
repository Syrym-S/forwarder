import { useTranslation } from "react-i18next";
import { Box, Tooltip, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import RenderStatus from "../../ui/render-status";

const useCustomersColumns = (setSelectedCustomer) => {
  const { t } = useTranslation();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: (row) => (
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={() => setSelectedCustomer(row.row)}
        >
          {row.id}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: t("ui.name_2"),
      width: 200,
    },
    { field: "bin", headerName: t("ui.bin"), width: 200 },
    {
      field: "type",
      headerName: t("ui.company_type"),
      width: 200,
    },
    {
      field: "legal_address",
      headerName: t("ui.address"),
      width: 200,
    },
    {
      field: "invite_link",
      headerName: t("ui.invitation_link_2"),
      width: 200,
      renderCell: ({ value }) => (
        <Tooltip title={t("ui.click_to_copy")}>
          <Typography
            component="span"
            onClick={() => navigator.clipboard.writeText(value)}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  return columns;
};

export default useCustomersColumns;
