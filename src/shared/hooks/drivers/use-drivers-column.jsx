import { useTranslation } from "react-i18next";
import Tooltip from "../../ui/action-tooltip";
import TooltipIconButton from "../../ui/tooltip-icon-button";
import { Box, Chip, IconButton } from "@mui/material";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const useDriversColumns = (
  setSelectedDriver,
  onBlockDriver,
  onCopyLink,
  isLinkLoading,
  regeneratingDriverId,
) => {
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
          onClick={() => setSelectedDriver(row.row)}
        >
          {row.id}
        </Box>
      ),
    },
    {
      field: "fio",
      headerName: t("ui.full_name"),
      width: 200,
    },
    {
      field: "in_black_list",
      headerName: t("ui.status"),
      width: 180,
      type: "boolean",
      renderCell: ({ value }) =>
        value === true ? (
          <Chip
            label={t("ui.blocked")}
            color="error"
            size="small"
            icon={<BlockOutlinedIcon />}
          />
        ) : null,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "iin",
      headerName: t("ui.iin"),
      width: 200,
    },
    {
      field: "company_name",
      headerName: t("ui.company"),
      width: 200,
      renderCell: ({ row }) => <>{row?.company_name || t("ui.not_specified")}</>,
    },
    {
      field: "legal_address",
      headerName: t("ui.address"),
      width: 200,
      renderCell: ({ row }) => <>{row?.legal_address || t("ui.not_specified")}</>,
    },
    {
      field: "invite_link",
      headerName: t("ui.link"),
      width: 100,
      align: "center",
      headerAlign: "center",
      resizable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      cellClassName: "driver-link-cell",
      headerClassName: "driver-link-header",
      renderCell: ({ row, hasFocus }) => (
        <TooltipIconButton
          title={t("ui.regenerate_and_copy_link")}
          color="primary"
          disabled={isLinkLoading || regeneratingDriverId !== null}
          loading={regeneratingDriverId === row.id}
          tabIndex={hasFocus ? 0 : -1}
          onClick={(event) => {
            event.stopPropagation();
            onCopyLink(row.id);
          }}
        >
          <ContentCopyOutlinedIcon />
        </TooltipIconButton>
      ),
    },
    {
      field: "actions",
      headerName: t("ui.actions"),
      width: 110,
      align: "center",
      headerAlign: "center",
      resizable: false,
      cellClassName: "driver-actions-cell",
      headerClassName: "driver-actions-header",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row, hasFocus }) => {
        if (row.in_black_list === true) {
          return (
            <Tooltip title={t("ui.driver_blocked")}>
              <span aria-label={t("ui.driver_blocked")}>
                <BlockOutlinedIcon
                  color="error"
                  sx={{ fontSize: 25, verticalAlign: "middle" }}
                />
              </span>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={t("ui.block_driver")}>
            <IconButton
              aria-label={t("ui.block_driver")}
              color="primary"
              tabIndex={hasFocus ? 0 : -1}
              onClick={(event) => {
                event.stopPropagation();
                onBlockDriver(row);
              }}
            >
              <BlockOutlinedIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return columns;
};

export default useDriversColumns;
