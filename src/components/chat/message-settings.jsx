import { useTranslation } from "react-i18next";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const MessageSettings = ({
  handleEdit,
  handleDelete,
  contextMenu,
  handleCloseContextMenu,
}) => {
  const { t } = useTranslation();
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? {
              top: contextMenu.mouseY,
              left: contextMenu.mouseX,
            }
          : undefined
      }
      slotProps={{
        paper: {
          sx: {
            minWidth: 180,
            borderRadius: 2,
            boxShadow: 3,
          },
        },
      }}
    >
      <MenuItem onClick={handleEdit}>
        <ListItemIcon>
          <ModeEditOutlineOutlinedIcon fontSize="small" />
        </ListItemIcon>{t("ui.edit")}</MenuItem>

      <MenuItem
        onClick={handleDelete}
        sx={{
          color: "error.main",
        }}
      >
        <ListItemIcon>
          <DeleteOutlineOutlinedIcon
            fontSize="small"
            sx={{ color: "error.main" }}
          />
        </ListItemIcon>{t("ui.delete")}</MenuItem>
    </Menu>
  );
};

export default MessageSettings;
