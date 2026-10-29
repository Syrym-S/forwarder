import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSoketLeadMessagesStore } from "../../app/store/soket-lead-messages/soket-lead-messages-store";

const chatAvatars = { get lead() { return appI18n.t("ui.customer_initial"); }, get cargo() { return appI18n.t("ui.driver_initial"); }, get factoring() { return appI18n.t("ui.factor_initial"); }, get support() { return appI18n.t("ui.support_initials"); } };

const Chatlist = ({ setChat }) => {
  const { t } = useTranslation();
  const [type, setType] = useState("all");
  const chats = useSoketLeadMessagesStore((state) => state.chats);
  const getChats = useSoketLeadMessagesStore((state) => state.getChats);
  const isChatsLoading = useSoketLeadMessagesStore(
    (state) => state.isChatsLoading,
  );
  const chatsError = useSoketLeadMessagesStore((state) => state.chatsError);
  const availableChats = chats.some((chat) => chat.chat_type === "support") ? chats : [...chats, { chat_type: "support", last_message: t("ui.contact_technical_support") }];
  const filteredChats = availableChats.filter((chat) => type === "all" || (chat.chat_type ?? chat.type ?? "lead") === type);

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1.25, pt: 1 }}>
      <Tabs value={type} onChange={(_, value) => setType(value)} scrollButtons={false} aria-label={t("ui.chat_type")}
        sx={{
          minHeight: 36,
          "& .MuiTabs-list, & .MuiTabs-flexContainer": { flexWrap: "wrap" },
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            minWidth: 0, minHeight: 36, px: 1.25, fontSize: 12,
            textTransform: "none", borderBottom: "2px solid transparent",
            "&.Mui-selected": { borderBottomColor: "primary.main" },
          },
        }}>
        <Tab value="all" label={t("ui.all")} />
        <Tab value="lead" label={t("ui.customers")} />
        <Tab value="cargo" label={t("ui.drivers")} />
        <Tab value="factoring" label={t("ui.factors")} />
        <Tab value="support" label={t("ui.technical_support")} />
      </Tabs>
      {isChatsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress aria-label={t("ui.loading_chats")} />
        </Box>
      ) : chatsError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={getChats}>{t("ui.retry")}</Button>
          }
        >
          {chatsError}
        </Alert>
      ) : filteredChats.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>{t("ui.no_chats_yet")}</Typography>
      ) : (
        <List disablePadding>
          {filteredChats.map((chat) => {
            const leadId = chat.lead_id ?? chat.lead?.id;
            const leadNum = chat.lead?.num;
            const chatType = chat.chat_type ?? chat.type ?? "lead";
            const lastMessage = chat.last_message;
            const preview =
              typeof lastMessage === "string"
                ? lastMessage
                : lastMessage?.message;
            const lead = chat.lead ?? chat;
            const from =
              lead.from_location?.city ?? lead.from_location?.address;
            const to = lead.to_location?.city ?? lead.to_location?.address;
            const title =
              (chatType === "support" ? t("ui.technical_support") : null) ?? chat.title ??
              chat.name ??
              (from && to ? `${from} - ${to}` : t("ui.lead_number_label", { value1: leadNum ?? "—" }));
            const date =
              chat.last_message_at ?? lastMessage?.created_at ?? chat.updated_at ?? chat.created_at;
            const formattedDate =
              date && dayjs(date).isValid() ? dayjs(date).format("DD.MM") : "";
            return (
              <ListItemButton
                key={chat.chat_id ?? chat.id ?? `${leadId}-${chatType}`}
                disabled={chatType !== "support" && !leadId}
                onClick={() => setChat(chat)}
                sx={{
                  px: { xs: 1, sm: 1.25 },
                  py: 1.25,
                  gap: 1.25,
                  minHeight: 66,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Badge badgeContent={chat.unread_count ?? 0} color="error">
                <Avatar
                  src={chat.avatar || undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#c92b68",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {chatAvatars[chatType] ?? t("ui.chat_initial")}
                </Avatar>
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    noWrap
                    color="text.secondary"
                    sx={{ fontSize: 13, mt: 0.5 }}
                  >
                    {preview ||
                      (lastMessage?.attachments?.length
                        ? t("ui.attachment")
                        : t("ui.no_messages"))}
                  </Typography>
                </Box>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 12,
                    alignSelf: "flex-start",
                    pt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  {formattedDate}
                </Typography>
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Chatlist;
