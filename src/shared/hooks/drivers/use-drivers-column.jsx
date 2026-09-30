import Tooltip from "../../ui/action-tooltip";
import TooltipIconButton from "../../ui/tooltip-icon-button";
import { Box, Chip, IconButton } from "@mui/material";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const useDriversColumns = (
  setSelectedDriver,
  onBlockDriver,
  onCopyLink,
) => {
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
      headerName: "ФИО",
      width: 200,
    },
    {
      field: "in_black_list",
      headerName: "Статус",
      width: 180,
      type: "boolean",
      renderCell: ({ value }) =>
        value === true ? (
          <Chip
            label="Заблокирован"
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
      headerName: "ИИН",
      width: 200,
    },
    {
      field: "company_name",
      headerName: "Компания",
      width: 200,
      renderCell: ({ row }) => <>{row?.company_name || "Не указан"}</>,
    },
    {
      field: "legal_address",
      headerName: "Адрес",
      width: 200,
      renderCell: ({ row }) => <>{row?.legal_address || "Не указан"}</>,
    },
    {
      field: "invite_link",
      headerName: "Ссылка",
      width: 100,
      align: "center",
      headerAlign: "center",
      resizable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      cellClassName: "driver-link-cell",
      headerClassName: "driver-link-header",
      renderCell: ({ value, hasFocus }) => (
        <Tooltip
          title={
            value ? "Скопировать пригласительную ссылку" : "Ссылка отсутствует"
          }
        >
          <span>
            <TooltipIconButton
              title="Скопировать пригласительную ссылку"
              aria-label="Скопировать пригласительную ссылку"
              color="primary"
              disabled={!value}
              tabIndex={hasFocus ? 0 : -1}
              onClick={(event) => {
                event.stopPropagation();
                onCopyLink(value);
              }}
            >
              <ContentCopyOutlinedIcon />
            </TooltipIconButton>
          </span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Действия",
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
            <Tooltip title="Водитель заблокирован">
              <span aria-label="Водитель заблокирован">
                <BlockOutlinedIcon
                  color="error"
                  sx={{ fontSize: 25, verticalAlign: "middle" }}
                />
              </span>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="Заблокировать водителя">
            <IconButton
              aria-label="Заблокировать водителя"
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
