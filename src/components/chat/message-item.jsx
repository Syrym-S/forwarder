import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ROLES, ROLES_ID } from "../../shared/const/roles";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MessageFileCard from "./message-file-card";
import dayjs from "dayjs";
import { useState } from "react";
import MessageSettings from "./message-settings";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useParams } from "react-router-dom";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import MessageStatus from "./message-status";

const MessageItem = ({ message, participants, messageType }) => {
  const { id } = useParams();
  const [contextMenu, setContextMenu] = useState(null);
  const [editedMessage, setEditedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const isDeleted = message.is_deleted;
  const isEdited = message.is_changed;
  const isForwarderSend = message.participant.role_id === ROLES_ID.forwarder;
  const isFactorSend = message.participant.role_id === ROLES_ID.factor;
  const isCustomerSend = message.participant.role_id === ROLES_ID.customer;

  const deleteMessage = useLeadsStore((state) => state.deleteMessage);
  const deletingMessage = useLeadsStore((state) => state.deletingMessage);
  const editMessage = useLeadsStore((state) => state.editMessage);

  const foctorData = participants?.find((user) => user.role === ROLES.factor);
  const customerData = participants?.find(
    (user) => user.role === ROLES.customer,
  );

  const senderData = isFactorSend
    ? foctorData
    : isCustomerSend
      ? customerData
      : null;

  const senderAvatar = senderData?.avatar;

  const handleContextMenu = (event) => {
    if (
      !isForwarderSend ||
      (!message.message && message.attachments.length === 0)
    )
      return false;

    event.preventDefault();

    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleOpenEdit = () => {
    handleCloseContextMenu();
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleConfirmEdit = async () => {
    const payload = {
      message: editedMessage,
      chat_type: messageType,
    };

    await editMessage(id, message.id, payload);

    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteMessage(id, message.id, {
      chat_type: messageType,
    });
    handleCloseContextMenu();
  };

  return (
    <>
      <Box
        key={message.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: isForwarderSend ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            gap: 1,
          }}
        >
          {!isForwarderSend &&
            (senderAvatar ? (
              <Box
                component="img"
                src={senderAvatar}
                alt={senderData?.person_fio || "User"}
                sx={{
                  display: "block",
                  borderRadius: "50%",
                  width: 25,
                  height: 25,
                  objectFit: "cover",
                  boxShadow: 2,
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 25,
                  height: 25,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "white",
                  boxShadow: 2,
                  flexShrink: 0,
                }}
              >
                <PersonOutlinedIcon fontSize="small" />
              </Box>
            ))}
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#4a94d9",
            }}
          >
            {senderData?.person_fio}
          </Typography>
        </Box>

        <Box
          onContextMenu={handleContextMenu}
          sx={{
            position: "relative",
            maxWidth: "70%",
            width: isEditing ? "50%" : "fit-content",
            px: 2,
            py: 1.5,
            borderRadius: isForwarderSend
              ? "16px 0px 16px 16px"
              : "0 16px 16px 16px",
            backgroundColor: isForwarderSend ? "primary.main" : "#f6f6f6",
            boxShadow: 1,
          }}
        >
          {isDeleted && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <BlockOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              >
                Сообщение удалено
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: "1fr",
            }}
          >
            {message.attachments.map((file) => (
              <MessageFileCard
                isForwarderSend={isForwarderSend}
                key={file.id}
                file={file}
                messageType={messageType}
              />
            ))}
          </Box>

          {isEditing ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 250,
              }}
            >
              <TextField
                fullWidth
                size="small"
                onInput={(e) => {
                  setEditedMessage(e.target.value);
                }}
                defaultValue={message.message}
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  },
                }}
              />

              <IconButton
                size="small"
                onClick={handleCloseEdit}
                sx={{
                  color: "error.main",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <IconButton size="small" onClick={handleConfirmEdit}>
                <CheckIcon
                  fontSize="small"
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: "1rem",
                  wordBreak: "break-word",
                  color: isForwarderSend ? "white" : "black",
                }}
              >
                {deletingMessage && deletingMessage === message.id ? (
                  <CircularProgress
                    sx={{
                      color: "white",
                    }}
                  />
                ) : (
                  message.message
                )}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    textAlign: "right",
                  }}
                >
                  {dayjs(message.created_at).format("DD.MM.YYYY HH:mm")}
                </Typography>

                {isEdited && (
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    изменено
                  </Typography>
                )}

                {isForwarderSend && (
                  <MessageStatus
                    is_arrived={message.is_arrived}
                    is_viewed={message.is_viewed}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      <MessageSettings
        contextMenu={contextMenu}
        handleEdit={handleOpenEdit}
        handleDelete={handleDelete}
        handleCloseContextMenu={handleCloseContextMenu}
      />
    </>
  );
};

export default MessageItem;
