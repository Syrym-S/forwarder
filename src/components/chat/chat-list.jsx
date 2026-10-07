import {
  Alert,
  Avatar,
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

const chatAvatars = { lead: "З", cargo: "В", factoring: "Ф#" };

const Chatlist = ({ setChat }) => {
  const [type, setType] = useState("all");
  const chats = useSoketLeadMessagesStore((state) => state.chats);
  const getChats = useSoketLeadMessagesStore((state) => state.getChats);
  const isChatsLoading = useSoketLeadMessagesStore(
    (state) => state.isChatsLoading,
  );
  const chatsError = useSoketLeadMessagesStore((state) => state.chatsError);
  const filteredChats = chats.filter((chat) => type === "all" || (chat.chat_type ?? chat.type ?? "lead") === type);

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1.25, pt: 1 }}>
      <Tabs value={type} onChange={(_, value) => setType(value)} variant="scrollable" scrollButtons="auto" aria-label="Тип чата"
        sx={{ minHeight: 36, "& .MuiTab-root": { minWidth: 0, minHeight: 36, px: 1, fontSize: 12, textTransform: "none" } }}>
        <Tab value="all" label="Все" />
        <Tab value="lead" label="Заказчики" />
        <Tab value="cargo" label="Водители" />
        <Tab value="factoring" label="Факторы" />
      </Tabs>
      {isChatsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress aria-label="Загрузка чатов" />
        </Box>
      ) : chatsError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={getChats}>
              Повторить
            </Button>
          }
        >
          {chatsError}
        </Alert>
      ) : filteredChats.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
          Чатов пока нет
        </Typography>
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
              chat.title ??
              chat.name ??
              (from && to ? `${from} - ${to}` : `Перевозка №${leadNum ?? "—"}`);
            const date =
              lastMessage?.created_at ?? chat.updated_at ?? chat.created_at;
            const formattedDate =
              date && dayjs(date).isValid() ? dayjs(date).format("DD.MM") : "";
            return (
              <ListItemButton
                key={chat.id ?? `${leadId}-${chatType}`}
                disabled={!leadId}
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
                  {chatAvatars[chatType] ?? "Ч"}
                </Avatar>
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
                        ? "Вложение"
                        : "Нет сообщений")}
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
