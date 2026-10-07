import { Alert, Avatar, Box, Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import { useEffect, useRef, useState } from "react";
import FloatingFilePreview from "./floating-file-preview";
import FloatingMessageItem from "./floating-message-item";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { downloadMessageFileApi, getChatTokenApi, getLeadMessagesApi, getMessageParticipantInfoApi, sendMessageApi } from "../../app/store/leads/api";


const FloatingChatMessages = ({ chat }) => {
  const leadId = chat.lead_id ?? chat.lead?.id;
  const chatType = chat.chat_type ?? chat.type ?? "lead";
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const [sending, setSending] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [participantError, setParticipantError] = useState(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const fileInput = useRef(null);
  const bottom = useRef(null);
  const reload = useRef(null);

  useEffect(() => {
    let disposed = false;
    let echo;
    let request = 0;
    const load = async () => {
      const currentRequest = ++request;
      try {
        const response = await getLeadMessagesApi(leadId, { chat_type: chatType });
        if (!disposed && currentRequest === request) {
          setMessages(response.data.data ?? []);
          setError(null);
        }
      } catch (failure) {
        if (!disposed) setError(failure.response?.data?.message || "Не удалось загрузить сообщения");
      } finally {
        if (!disposed) setLoading(false);
      }
    };
    reload.current = load;
    const connect = async () => {
      try {
        const response = await getChatTokenApi(leadId, chatType);
        if (disposed) return;
        const { token, chat_id } = response.data;
        const config = window.ChatWS_Config;
        const wsUrl = new URL(config.ws);
        echo = new Echo({ broadcaster: "reverb", client: new Pusher(config.key, {
          wsHost: wsUrl.hostname, wsPort: 443, wssPort: 443, forceTLS: true,
          enabledTransports: ["ws", "wss"], cluster: "", authEndpoint: config.auth,
          auth: { headers: { Authorization: `Bearer ${token}` } },
        }) });
        const channel = echo.private(`chats.${chat_id}`);
        [".message.sent", ".message.deleted", ".message.updated", ".messages.read"].forEach((event) => channel.listen(event, load));
        await load();
      } catch {
        if (!disposed) setSocketError("Не удалось подключить обновления чата. Откройте чат повторно, чтобы переподключиться.");
      }
    };
    load();
    getMessageParticipantInfoApi(leadId, chatType).then((response) => {
      if (!disposed) setParticipants(response.data.data ?? []);
    }).catch(() => { if (!disposed) setParticipantError("Не удалось загрузить участников чата"); });
    connect();
    return () => { disposed = true; reload.current = null; echo?.disconnect(); };
  }, [leadId, chatType]);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages.length]);

  const send = async () => {
    if (sending || (!text.trim() && !files.length)) return;
    const payload = new FormData();
    payload.append("chat_type", chatType);
    if (text.trim()) payload.append("message", text.trim());
    files.forEach((file) => payload.append("file[]", file));
    setSending(true);
    try {
      await sendMessageApi(leadId, payload);
      setText("");
      setFiles([]);
      await reload.current?.();
    } catch (failure) {
      setError(failure.response?.data?.message || "Не удалось отправить сообщение");
    } finally { setSending(false); }
  };

  const download = async (file) => {
    setDownloadingId(file.id);
    try {
      const response = await downloadMessageFileApi(leadId, file.id, chatType);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name || "file";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError("Не удалось скачать вложение"); } finally { setDownloadingId(null); }
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{({ lead: "Чат с заказчиком", cargo: "Чат с водителем", factoring: "Чат о факторинговой покупке" })[chatType] ?? "Чат"}</Typography>
        <Box sx={{ display: "flex", gap: 0.75, mt: 0.5, overflowX: "auto" }}>{participants.map((participant, index) => <Box key={participant.id ?? index} sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <Avatar src={participant.avatar} sx={{ width: 24, height: 24, fontSize: 11 }}>{(participant.person_fio ?? participant.name ?? "У").charAt(0)}</Avatar>
          <Typography sx={{ fontSize: 11 }}>{participant.person_fio ?? participant.name ?? participant.role}</Typography>
        </Box>)}</Box>
      </Box>
      {participantError && <Alert severity="warning" sx={{ fontSize: 12 }}>{participantError}</Alert>}
      {socketError && <Alert severity="warning" sx={{ fontSize: 12 }}>{socketError}</Alert>}
      {error && <Alert severity="error" action={<Button color="inherit" onClick={() => reload.current?.()}>Повторить</Button>}>{error}</Alert>}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 1.5 }}>
        {loading ? <Box sx={{ textAlign: "center", p: 3 }}><CircularProgress size={28} /></Box> : !messages.length ? <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Сообщений пока нет</Typography> : messages.map((message) => (
          <FloatingMessageItem key={message.id} message={message} participants={participants} leadId={leadId} chatType={chatType}
            onReload={() => reload.current?.()} onError={setError} onDownload={download} downloadingId={downloadingId} />
        ))}
        <div ref={bottom} />
      </Box>
      <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        {files.length > 0 && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>{files.map((file, index) => <FloatingFilePreview key={`${file.name}-${index}`} file={file} disabled={sending} onRemove={() => setFiles((current) => current.filter((_, i) => i !== index))} />)}</Box>}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
          <TextField fullWidth multiline maxRows={3} size="small" placeholder="Введите сообщение…" value={text} disabled={sending} onChange={(event) => setText(event.target.value)} slotProps={{ htmlInput: { "aria-label": "Текст сообщения" } }} />
          <IconButton color="primary" aria-label="Отправить сообщение" disabled={loading || sending || (!text.trim() && !files.length)} onClick={send}>{sending ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}</IconButton>
          <IconButton color="primary" aria-label="Прикрепить изображение" disabled={sending} onClick={() => fileInput.current?.click()}><PanoramaOutlinedIcon fontSize="small" /></IconButton>
          <input hidden ref={fileInput} type="file" accept="image/*" multiple onChange={(event) => { setFiles((current) => [...current, ...Array.from(event.target.files)]); event.target.value = ""; }} />
        </Box>
      </Box>
    </Box>
  );
};

export default FloatingChatMessages;
