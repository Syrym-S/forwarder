import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import { useEffect, useRef, useState } from "react";
import FloatingFilePreview from "./floating-file-preview";
import FloatingMessageItem from "./floating-message-item";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  downloadMessageFileApi,
  getChatTokenApi,
  getLeadMessagesApi,
  getMessageParticipantInfoApi,
  sendMessageApi,
} from "../../app/store/leads/api";

import {
  getSupportMessagesApi,
  sendSupportMessageApi,
  readSupportMessagesApi,
  downloadSupportFileApi,
  getSupportTokenApi,
} from "../../app/store/support-chat/api";

const FloatingChatMessages = ({ chat }) => {
  const { t } = useTranslation();
  const leadId = chat.lead_id ?? chat.lead?.id;
  const chatType = chat.chat_type ?? chat.type ?? "lead";
  const isSupport = chatType === "support";
  const [participantId, setParticipantId] = useState(null);
  const [olderPage, setOlderPage] = useState(undefined);
  const [loadingOlder, setLoadingOlder] = useState(false);
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
  const loadedSupportPages = useRef(1);

  useEffect(() => {
    let disposed = false;
    let echo;
    let request = 0;
    const load = async () => {
      const currentRequest = ++request;
      try {
        const supportResponses = isSupport
          ? await Promise.all(
              Array.from({ length: loadedSupportPages.current }, (_, index) =>
                getSupportMessagesApi(index + 1),
              ),
            )
          : null;
        const response = isSupport
          ? supportResponses[0]
          : await getLeadMessagesApi(leadId, {
              chat_type: chatType,
            });
        if (!disposed && currentRequest === request) {
          setMessages(() =>
            isSupport
              ? [
                  ...new Map(
                    supportResponses
                      .flatMap((page) => page.data.data ?? [])
                      .map((message) => [message.id, message]),
                  ).values(),
                ].sort((a, b) => a.id - b.id)
              : (response.data.data ?? []),
          );
          if (isSupport) {
            setParticipantId(response.data.participant_id);
            setOlderPage((previous) =>
              previous === undefined
                ? response.data.meta?.last_page > 1
                  ? 2
                  : null
                : previous,
            );
          }
          setError(null);
        }
      } catch (failure) {
        if (!disposed)
          setError(
            failure.response?.data?.message || appI18n.t("ui.messages_load_failed"),
          );
      } finally {
        if (!disposed) setLoading(false);
      }
    };
    reload.current = load;
    const connect = async () => {
      try {
        const response = isSupport
          ? await getSupportTokenApi()
          : await getChatTokenApi(leadId, chatType);
        if (disposed) return;
        const { token, chat_id } = response.data;
        if (isSupport) setParticipantId(response.data.participant_id);
        const config = window.ChatWS_Config;
        const wsUrl = new URL(config.ws);
        echo = new Echo({
          broadcaster: "reverb",
          client: new Pusher(config.key, {
            wsHost: wsUrl.hostname,
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            enabledTransports: ["ws", "wss"],
            cluster: "",
            authEndpoint: config.auth,
            auth: { headers: { Authorization: `Bearer ${token}` } },
          }),
        });
        const channel = echo.private(`chats.${chat_id}`);
        [
          ".message.sent",
          ".message.deleted",
          ".message.updated",
          ".messages.read",
        ].forEach((event) =>
          channel.listen(event, async () => {
            if (disposed) return;
            if (isSupport && event === ".message.sent") {
              try {
                await readSupportMessagesApi();
              } catch {
                if (!disposed)
                  setError(appI18n.t("ui.mark_messages_read_failed"));
              }
            }
            if (!disposed) await load();
          }),
        );
        await load();
      } catch {
        if (!disposed)
          setSocketError(
            appI18n.t("ui.chat_connection_failed"),
          );
      }
    };
    load();
    if (!isSupport)
      getMessageParticipantInfoApi(leadId, chatType)
        .then((response) => {
          if (!disposed) setParticipants(response.data.data ?? []);
        })
        .catch(() => {
          if (!disposed)
            setParticipantError(appI18n.t("ui.chat_participants_load_failed"));
        });
    connect();
    return () => {
      disposed = true;
      reload.current = null;
      echo?.disconnect();
    };
  }, [leadId, chatType, isSupport]);

  const lastMessageId = messages.at(-1)?.id;
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [lastMessageId]);

  const send = async () => {
    if (sending || (!text.trim() && !files.length)) return;
    const payload = new FormData();
    if (!isSupport) payload.append("chat_type", chatType);
    if (text.trim()) payload.append("message", text.trim());
    files.forEach((file) => payload.append("file[]", file));
    setSending(true);
    try {
      if (isSupport) await sendSupportMessageApi(payload);
      else await sendMessageApi(leadId, payload);
      setText("");
      setFiles([]);
      await reload.current?.();
    } catch (failure) {
      setError(
        failure.response?.data?.message || t("ui.send_message_failed"),
      );
    } finally {
      setSending(false);
    }
  };

  const download = async (file) => {
    setDownloadingId(file.id);
    try {
      const response = isSupport
        ? await downloadSupportFileApi(file.id)
        : await downloadMessageFileApi(leadId, file.id, chatType);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name || "file";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError(t("ui.attachment_download_failed"));
    } finally {
      setDownloadingId(null);
    }
  };

  if (messages.length === 0)
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {{
            support: t("ui.technical_support"),
            lead: t("ui.customer_chat"),
            cargo: t("ui.driver_chat"),
            factoring: t("ui.factoring_purchase_chat"),
          }[chatType] ?? t("ui.chat")}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.75, mt: 0.5, overflowX: "auto" }}>
          {participants.map((participant, index) => (
            <Box
              key={participant.id ?? index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              <Avatar
                src={participant.avatar}
                sx={{ width: 24, height: 24, fontSize: 11 }}
              >
                {(participant.person_fio ?? participant.name ?? t("ui.participant_initial")).charAt(0)}
              </Avatar>
              <Typography sx={{ fontSize: 11 }}>
                {participant.person_fio ?? participant.name ?? participant.role}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {participantError && (
        <Alert severity="warning" sx={{ fontSize: 12 }}>
          {participantError}
        </Alert>
      )}
      {socketError && (
        <Alert severity="warning" sx={{ fontSize: 12 }}>
          {socketError}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => reload.current?.()}>{t("ui.retry")}</Button>
          }
        >
          {error}
        </Alert>
      )}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 1.5 }}>
        {isSupport && olderPage && (
          <Button
            disabled={loadingOlder}
            onClick={async () => {
              setLoadingOlder(true);
              try {
                const response = await getSupportMessagesApi(olderPage);
                loadedSupportPages.current = olderPage;
                setMessages((previous) =>
                  [
                    ...new Map(
                      [...(response.data.data ?? []), ...previous].map(
                        (message) => [message.id, message],
                      ),
                    ).values(),
                  ].sort((a, b) => a.id - b.id),
                );
                setOlderPage(
                  response.data.meta?.current_page <
                    response.data.meta?.last_page
                    ? olderPage + 1
                    : null,
                );
              } catch {
                setError(t("ui.message_history_load_failed"));
              } finally {
                setLoadingOlder(false);
              }
            }}
          >
            {loadingOlder ? t("ui.loading") : t("ui.earlier_messages")}
          </Button>
        )}
        {loading ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !messages.length ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t("ui.no_messages_yet_2")}</Typography>
        ) : (
          messages.map((message) => (
            <FloatingMessageItem
              key={message.id}
              message={message}
              participantId={participantId}
              participants={participants}
              leadId={leadId}
              chatType={chatType}
              onReload={() => reload.current?.()}
              onError={setError}
              onDownload={download}
              downloadingId={downloadingId}
            />
          ))
        )}
        <div ref={bottom} />
      </Box>
      <Box
        sx={{
          p: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {files.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
            {files.map((file, index) => (
              <FloatingFilePreview
                key={`${file.name}-${index}`}
                file={file}
                disabled={sending}
                onRemove={() =>
                  setFiles((current) => current.filter((_, i) => i !== index))
                }
              />
            ))}
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder={t("ui.enter_message")}
            value={text}
            disabled={sending}
            onChange={(event) => setText(event.target.value)}
            slotProps={{ htmlInput: { "aria-label": t("ui.message_text") } }}
          />
          <IconButton
            color="primary"
            aria-label={t("ui.send_message")}
            disabled={loading || sending || (!text.trim() && !files.length)}
            onClick={send}
          >
            {sending ? (
              <CircularProgress size={20} />
            ) : (
              <SendIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            color="primary"
            aria-label={
              isSupport ? t("ui.attach_file") : t("ui.attach_image")
            }
            disabled={sending}
            onClick={() => fileInput.current?.click()}
          >
            <PanoramaOutlinedIcon fontSize="small" />
          </IconButton>
          <input
            hidden
            ref={fileInput}
            type="file"
            accept={isSupport ? undefined : "image/*"}
            multiple
            onChange={(event) => {
              setFiles((current) => [
                ...current,
                ...Array.from(event.target.files),
              ]);
              event.target.value = "";
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FloatingChatMessages;
