import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { getChatTokenApi } from "../../../app/store/leads/api";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

window.Pusher = Pusher;

const useChatEcho = (leadId) => {
  const getNewMessage = useLeadsStore((state) => state.getNewMessage);
  const updateMessage = useLeadsStore((state) => state.updateMessage);
  const deleteMessageFromSocket = useLeadsStore(
    (state) => state.deleteMessageFromSocket,
  );
  const readMessages = useLeadsStore((state) => state.readMessages);

  useEffect(() => {
    if (!leadId) return;

    let echo;

    const connect = async () => {
      try {
        const response = await getChatTokenApi(leadId);

        console.log("CHAT TOKEN RESPONSE:", response);

        const { token, chat_id } = response.data;

        const wsUrl = new URL(window.ChatWS_Config.ws);

        echo = new Echo({
          broadcaster: "reverb",

          key: window.ChatWS_Config.key,

          wsHost: wsUrl.hostname,

          wsPort: 443,
          wssPort: 443,

          forceTLS: true,

          enabledTransports: ["ws", "wss"],

          authEndpoint: window.ChatWS_Config.auth,

          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        echo
          .private(`chats.${chat_id}`)

          .listen(".message.sent", (event) => {
            getNewMessage(event.message);
          })

          .listen(".message.deleted", (event) => {
            deleteMessageFromSocket(event.message);
          })

          .listen(".message.updated", (event) => {
            updateMessage(event.message);
          })

          .listen(".messages.read", (event) => {
            readMessages(event.message);
          });

        console.log("Echo connected");
      } catch (error) {
        console.error("Echo error:", error);
      }
    };

    connect();

    return () => {
      if (echo) {
        echo.disconnect();
      }
    };
  }, [leadId, getNewMessage]);
};

export default useChatEcho;
