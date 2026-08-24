import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { ROLES } from "../../shared/const/roles";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import SendIcon from "@mui/icons-material/Send";

const messagesMock = [
  {
    id: 1,
    senderId: 101,
    text: "Здравствуйте! Хотел уточнить информацию по грузу.",
    createdAt: "2026-08-24T08:10:00",
    role: "customer",
  },
  {
    id: 2,
    senderId: 101,
    text: "Подскажите, пожалуйста, когда планируется погрузка?",
    createdAt: "2026-08-24T08:12:00",
    role: "customer",
  },
  {
    id: 3,
    senderId: 101,
    text: "Также хотел узнать точный адрес загрузки.",
    createdAt: "2026-08-24T08:15:00",
    role: "customer",
  },
];

const ChatFirstVertion = ({ mockUser }) => {
  const [sentMeassages, setSentMessages] = useState([]);

  const allMessages = [...messagesMock, ...sentMeassages];

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        my: 1,
        minHeight: 500,
        maxHeight: 700,
        overflowY: "auto",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          py: 2,
          px: 5,
          backgroundColor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={mockUser.avatar}
            alt={mockUser.fio}
            sx={{
              display: "block",
              borderRadius: "100%",
              width: "80px",
              height: "80px",
              objectFit: "cover",
              boxShadow: 2,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {mockUser.fio}
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                textTransform: "capitalize",
                color: "#5c5b5b",
              }}
            >
              Заказщик
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Stack
        spacing={2}
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
        }}
      >
        {allMessages.map((message) => {
          const isForwarderSend = message.role === ROLES.forwarder;

          return (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: isForwarderSend ? "flex-end" : "flex-start",
              }}
            >
              {!isForwarderSend && (
                <Box
                  component="img"
                  src={mockUser.avatar}
                  sx={{
                    display: "block",
                    borderRadius: "100%",
                    width: "35px",
                    height: "35px",
                    objectFit: "cover",
                    boxShadow: 2,
                  }}
                />
              )}

              <Box
                sx={{
                  maxWidth: "70%",
                  px: 2,
                  py: 1.5,
                  borderRadius: isForwarderSend
                    ? "16px 0px 16px 16px"
                    : "0 16px 16px 16px",
                  backgroundColor: isForwarderSend ? "white" : "#9faaffab",
                  boxShadow: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    wordBreak: "break-word",
                    color: isForwarderSend ? "black" : "white",
                  }}
                >
                  {message.text}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    textAlign: "right",
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
      <ChatMessageInput setSentMessages={setSentMessages} />
    </Paper>
  );
};

export default ChatFirstVertion;

const ChatMessageInput = ({ setSentMessages }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const newSentMessage = {
      id: crypto.randomUUID(),
      text: inputValue,
      createdAt: currentDateTime,
      role: "forwarder",
      files: selectedFiles,
    };

    setSentMessages((prev) => [...prev, newSentMessage]);

    setInputValue("");
    setSelectedFiles([]);
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
        {/* Выбранные файлы */}
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

        {/* Текстовый инпут */}
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
          <SendIcon />
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
