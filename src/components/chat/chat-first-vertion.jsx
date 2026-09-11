import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useParams } from "react-router-dom";
import MessageList from "./message-list";
import useChatEcho from "../../shared/hooks/chat/use-chat-echo";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ParticipantData from "./participants/participant-data";

const ChatFirstVertion = ({ messageType }) => {
  const { id } = useParams();

  const participantData = useLeadsStore((state) => state.participantData);

  const isMessagesLoading = useLeadsStore((state) => state.isMessagesLoading);
  const leadMessages = useLeadsStore((state) => state.leadMessages);
  const getLeadMessages = useLeadsStore((state) => state.getLeadMessages);
  const getMessageParticipantInfo = useLeadsStore(
    (state) => state.getMessageParticipantInfo,
  );

  const isEmpty = leadMessages?.length === 0;
  const isFactoringChat = messageType === "factoring";

  useEffect(() => {
    getLeadMessages(id, {
      chat_type: messageType,
    });
    getMessageParticipantInfo(id, messageType);
  }, []);

  useChatEcho(id, messageType);

  if (!participantData) return <CircularProgress />;

  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        my: 1,
        mx: 1,
        minHeight: 500,
        maxHeight: 700,
        overflowY: "auto",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      <ParticipantData
        participantData={participantData}
        isFactoringChat={isFactoringChat}
      />

      {isEmpty && !isMessagesLoading && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.50",
              mb: 2,
            }}
          >
            <ForumOutlinedIcon
              sx={{
                fontSize: 36,
                color: "primary.main",
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Пока нет сообщения
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 240,
              lineHeight: 1.5,
            }}
          >
            Здесь будут отображаться ваши диалоги и новые сообщения.
          </Typography>
        </Box>
      )}

      <MessageList participants={participantData} messageType={messageType} />

      <ChatMessageInput messageType={messageType} />
    </Paper>
  );
};

export default ChatFirstVertion;

const ChatMessageInput = ({ messageType }) => {
  const { id } = useParams();

  const sendMessage = useLeadsStore((state) => state.sendMessage);
  const isSendingLoading = useLeadsStore((state) => state.isSendingLoading);

  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue?.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();

    formData.append("chat_type", messageType);

    if (inputValue?.trim()) {
      formData.append("message", inputValue.trim());
    }

    selectedFiles.forEach((file) => {
      formData.append("file[]", file);
    });

    try {
      setInputValue("");
      setSelectedFiles([]);

      await sendMessage(id, formData);
    } catch (error) {
      console.error("Ошибка отправки:", error);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    setSelectedFiles((prev) => [...prev, ...files]);

    event.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        p: 2,
        backgroundColor: "white",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          px: 2,
          py: 1,
        }}
      >
        {selectedFiles.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            {selectedFiles.map((file, index) => (
              <Box
                key={`${file.name}-${index}`}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 0.5,
                  pr: 3.5,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                  maxWidth: 180,
                }}
              >
                {file.type.startsWith("image/") ? (
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1.5,
                      backgroundColor: "grey.200",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    FILE
                  </Box>
                )}

                <Box
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 13,
                  }}
                >
                  {file.name}
                </Box>

                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    position: "absolute",
                    right: 2,
                    top: 2,
                    width: 22,
                    height: 22,
                  }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <TextField
          value={inputValue}
          fullWidth
          placeholder="Введите сообщение..."
          multiline
          maxRows={4}
          variant="standard"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
        />
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <Box sx={{ display: "flex" }}>
        <IconButton
          onClick={handleSendMessage}
          color="primary"
          sx={{
            width: 44,
            height: 44,
            mb: 0.2,
          }}
        >
          {isSendingLoading ? <CircularProgress size="small" /> : <SendIcon />}
        </IconButton>

        <IconButton
          onClick={() => fileInputRef.current?.click()}
          color="primary"
          sx={{
            width: 44,
            height: 44,
            mb: 0.2,
          }}
        >
          <PanoramaOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
