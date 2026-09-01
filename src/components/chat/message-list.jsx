import { CircularProgress, Stack } from "@mui/material";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import MessageItem from "./message-item";
import { useEffect, useRef } from "react";
import MessageItemSkeleton from "../../shared/ui/loaders/message-item-skeleton";

const MessageList = ({ participants, messageType }) => {
  const newMessage = useLeadsStore((state) => state.newMessage);
  const leadMessages = useLeadsStore((state) => state.leadMessages);
  const isMessagesLoading = useLeadsStore((state) => state.isMessagesLoading);

  const chatRef = useRef(null);

  useEffect(() => {
    const chat = chatRef.current;

    if (!chat || isMessagesLoading) return;

    chat.scrollTop = chat.scrollHeight;
  }, [leadMessages?.length, isMessagesLoading]);

  if (isMessagesLoading)
    return (
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );

  return (
    <Stack
      spacing={2}
      ref={chatRef}
      sx={{
        flex: 1,
        p: {
          xs: 1,
          md: 3,
        },
        overflowY: "auto",
      }}
    >
      {leadMessages?.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          messageType={messageType}
          participants={participants}
        />
      ))}

      {newMessage && <MessageItemSkeleton />}
    </Stack>
  );
};

export default MessageList;
