import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
            aria-label={t("ui.chat_list")}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
            }}
            sx={{
              width: { xs: "calc(100vw - 32px)", sm: 480 },
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 0,
                }}
              >
                {activeChat && (
                  <IconButton
                    aria-label={t("ui.back_to_chat_list")}
                    onClick={() => setActiveChat(null)}
                  >
                    <ArrowBackOutlinedIcon />
                  </IconButton>
                )}
                <Typography noWrap sx={{ fontSize: 16 }}>
                  {activeChat
                    ? (activeChat.chat_type === "support" ? t("ui.technical_support") : activeChat.title ??
                      activeChat.name ??
                      t("ui.lead_number_label", { value1: activeChat.lead?.num ?? activeChat.lead_id ?? activeChat.lead?.id }))
                    : t("ui.lead_chats")}
                </Typography>
              </Box>
              <IconButton
                color="error"
                aria-label={t("ui.close_chat_list")}
                onClick={() => setIsOpen(false)}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Box>
            {activeChat ? (
              <FloatingChatMessages
                key={`${activeChat.lead_id ?? activeChat.lead?.id}-${activeChat.chat_type ?? activeChat.type ?? "lead"}`}
                chat={activeChat}
              />
            ) : (
              <Chatlist setChat={openChat} />
            )}
          </Paper>
        ) : (
          <IconButton
            title={t("ui.open_chat_list")}
            aria-label={t("ui.open_chat_list")}
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
