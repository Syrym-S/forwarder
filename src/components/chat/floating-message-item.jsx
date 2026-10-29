import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, CircularProgress, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useState } from "react";
import dayjs from "dayjs";
import { deleteMessageApi, editMessageApi } from "../../app/store/leads/api";
import { editSupportMessageApi, deleteSupportMessageApi } from "../../app/store/support-chat/api";
import { ROLES, ROLES_ID } from "../../shared/const/roles";

const FloatingMessageItem = ({ message, participants, leadId, chatType, onReload, onError, onDownload, downloadingId, participantId }) => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const own = chatType === "support" ? participantId != null && String(message.participant_id) === String(participantId) : Number(message.participant?.role_id) === ROLES_ID.forwarder;
  const role = Number(message.participant?.role_id) === ROLES_ID.factor ? ROLES.factor : Number(message.participant?.role_id) === ROLES_ID.customer ? ROLES.customer : null;
  const sender = participants.find((participant) => participant.id != null && String(participant.id) === String(message.participant_id ?? message.participant?.id)) ?? participants.find((participant) => role && participant.role === role) ?? message.participant;
  const canChange = own && !message.is_deleted && !busy;
  const openMenu = (event) => {
    if (!canChange) return;
    event.preventDefault();
    setMenu({ top: event.clientY, left: event.clientX });
  };
  const mutate = async (action) => {
    if (!canChange) return;
    setMenu(null);
    setBusy(true);
    try {
      if (action === "edit") {
        if (chatType === "support") await editSupportMessageApi(message.id, draft.trim());
        else await editMessageApi(leadId, message.id, { chat_type: chatType, message: draft.trim() });
        setEditing(false);
      } else {
        if (chatType === "support") await deleteSupportMessageApi(message.id);
        else await deleteMessageApi(leadId, message.id, { chat_type: chatType });
      }
      await onReload();
    } catch (error) { onError(error.response?.data?.message || t("ui.edit_message_failed")); }
    finally { setBusy(false); }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: own ? "flex-end" : "flex-start", mb: 2 }}>
      {!own && <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
        <Avatar src={sender?.avatar} sx={{ width: 24, height: 24, fontSize: 12 }}>{(sender?.person_fio ?? sender?.name ?? t("ui.participant_initial")).charAt(0)}</Avatar>
        <Typography color="primary" sx={{ fontSize: 11 }}>{sender?.person_fio ?? sender?.name ?? (chatType === "support" ? t("ui.technical_support") : "")}</Typography>
      </Box>}
      <Box sx={{ display: "flex", alignItems: "flex-start", maxWidth: "100%", minWidth: 0 }}>
        <Box onContextMenu={openMenu} sx={{ minWidth: 0, px: 1.25, py: 1, borderRadius: 2, bgcolor: own ? "primary.main" : "action.hover", color: own ? "primary.contrastText" : "text.primary" }}>
          {busy && <CircularProgress size={18} color="inherit" />}
          {editing && !message.is_deleted ? <Box>
            <TextField autoFocus fullWidth multiline maxRows={4} size="small" value={draft} disabled={busy} onChange={(event) => setDraft(event.target.value)} slotProps={{ htmlInput: { "aria-label": t("ui.edit_message") } }} sx={{ bgcolor: "background.paper", borderRadius: 1 }} />
            <IconButton size="small" aria-label={t("ui.cancel_editing")} disabled={busy} onClick={() => setEditing(false)} sx={{ color: "inherit" }}><CloseIcon fontSize="small" /></IconButton>
            <IconButton size="small" aria-label={t("ui.save_changes")} disabled={busy || !draft.trim() || draft.trim() === message.message} onClick={() => mutate("edit")} sx={{ color: "inherit" }}><CheckIcon fontSize="small" /></IconButton>
          </Box> : <Typography sx={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontStyle: message.is_deleted ? "italic" : "normal" }}>{message.is_deleted ? t("ui.message_deleted") : message.message}</Typography>}
          {!message.is_deleted && message.attachments?.map((file) => <Box key={file.id} sx={{ display: "flex", alignItems: "center", gap: 0.5, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 0.5, mt: 0.5 }}>
            {file.file_name?.toLowerCase().endsWith(".pdf") ? <PictureAsPdfOutlinedIcon fontSize="small" /> : <InsertDriveFileOutlinedIcon fontSize="small" />}
            <Box sx={{ flex: 1, minWidth: 0 }}><Typography noWrap sx={{ fontSize: 12 }}>{file.file_name || t("ui.attachment")}</Typography><Typography sx={{ fontSize: 10, opacity: 0.7 }}>{/\.(png|jpe?g|webp)$/i.test(file.file_name ?? "") ? t("ui.image") : t("ui.document")}</Typography></Box>
            <Button size="small" aria-label={t("ui.download_named_file", { value1: file.file_name || t("ui.file_lowercase") })} disabled={downloadingId === file.id} onClick={() => onDownload(file)} sx={{ color: "inherit", minWidth: 28 }}>{downloadingId === file.id ? <CircularProgress size={16} color="inherit" /> : <DownloadOutlinedIcon fontSize="small" />}</Button>
          </Box>)}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <Typography sx={{ fontSize: 10, opacity: 0.7 }}>{dayjs(message.created_at).format("DD.MM.YYYY HH:mm")}{message.is_changed && !message.is_deleted ? t("ui.edited_marker") : ""}</Typography>
            {own && (message.is_arrived ? <DoneAllIcon sx={{ fontSize: 16, color: message.is_viewed || message.is_read ? "#90caf9" : "inherit" }} /> : <DoneIcon sx={{ fontSize: 16, opacity: 0.7 }} />)}
          </Box>
        </Box>
        {canChange && !editing && <IconButton size="small" aria-label={t("ui.message_actions")} onClick={openMenu}><MoreVertIcon fontSize="small" /></IconButton>}
      </Box>
      <Menu open={Boolean(menu)} onClose={() => setMenu(null)} anchorReference="anchorPosition" anchorPosition={menu ?? undefined}>
        <MenuItem disabled={!message.message} onClick={() => { setDraft(message.message ?? ""); setEditing(true); setMenu(null); }}>{t("ui.edit")}</MenuItem>
        <MenuItem sx={{ color: "error.main" }} onClick={() => mutate("delete")}>{t("ui.delete")}</MenuItem>
      </Menu>
    </Box>
  );
};

export default FloatingMessageItem;
