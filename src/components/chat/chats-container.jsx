import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import FloatingChatMessages from "./floating-chat-messages";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Chatlist from "./chat-list";

const ChatsContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const openChat = (chat) => {
    setActiveChat(chat);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
        {isOpen ? (
          <Paper
            elevation={6}
            role="dialog"
            aria-label="Список чатов"
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
            }}
            sx={{
              width: { xs: "calc(100vw - 32px)", sm: 360 },
              height: "min(480px, calc(100dvh - 88px))",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.75,
                py: 1,
                minHeight: 54,
                boxSizing: "border-box",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.16)",
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                {activeChat && <IconButton aria-label="Назад к списку чатов" onClick={() => setActiveChat(null)}><ArrowBackOutlinedIcon /></IconButton>}
                <Typography noWrap sx={{ fontSize: 16 }}>{activeChat ? activeChat.title ?? activeChat.name ?? `Перевозка №${activeChat.lead?.num ?? activeChat.lead_id ?? activeChat.lead?.id}` : "Чаты перевозок"}</Typography>
              </Box>
              <IconButton
                color="error"
                aria-label="Закрыть список чатов"
                onClick={() => setIsOpen(false)}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Box>
            {activeChat ? <FloatingChatMessages key={`${activeChat.lead_id ?? activeChat.lead?.id}-${activeChat.chat_type ?? activeChat.type ?? "lead"}`} chat={activeChat} /> : <Chatlist setChat={openChat} />}
          </Paper>
        ) : (
          <IconButton
            title="Открыть список чатов"
            aria-label="Открыть список чатов"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              boxShadow: 6,
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <ForumOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default ChatsContainer;
