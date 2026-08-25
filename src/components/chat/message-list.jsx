import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { ROLES_ID } from "../../shared/const/roles";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import dayjs from "dayjs";
import MessageFileCard from "./message-file-card";

const MessageList = ({ participant, messageType }) => {
  const leadMessages = useLeadsStore((state) => state.leadMessages);
  const isMessagesLoading = useLeadsStore((state) => state.isMessagesLoading);

  if (isMessagesLoading)
    return (
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
        }}
      >
        <CircularProgress />
      </Stack>
    );

  return (
    <Stack
      spacing={2}
      sx={{
        flex: 1,
        p: 3,
        overflowY: "auto",
      }}
    >
      {leadMessages?.map((message) => {
        const isForwarderSend =
          message.participant.role_id === ROLES_ID.forwarder;

        return (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: isForwarderSend ? "flex-end" : "flex-start",
            }}
          >
            {!isForwarderSend &&
              (participant?.avatar ? (
                <Box
                  component="img"
                  src={participant?.avatar}
                  sx={{
                    display: "block",
                    borderRadius: "100%",
                    width: "35px",
                    height: "35px",
                    objectFit: "cover",
                    boxShadow: 2,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: 2,
                    flexShrink: 0,
                  }}
                >
                  <PersonOutlinedIcon />
                </Box>
              ))}

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
              {message.attachments.map((file) => (
                <MessageFileCard file={file} messageType={messageType} />
              ))}
              <Typography
                sx={{
                  fontSize: "1rem",
                  wordBreak: "break-word",
                  color: isForwarderSend ? "black" : "white",
                }}
              >
                {message.message}
              </Typography>

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
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

export default MessageList;
