import { api } from "../../client";

export const getChatsApi = async () => {
  const data = await api("/forwarder/v1/chats");

  return data;
};
