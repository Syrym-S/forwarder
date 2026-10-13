import { api } from "../../client";

const base = "/forwarder/v1/support-chat";

export const getSupportMessagesApi = (page = 1) => api.get(`${base}/messages`, { params: { page } });
export const sendSupportMessageApi = (payload) => api.post(`${base}/messages`, payload);
export const editSupportMessageApi = (id, message) => api.put(`${base}/messages/${id}`, { message });
export const deleteSupportMessageApi = (id) => api.delete(`${base}/messages/${id}`);
export const readSupportMessagesApi = () => api.post(`${base}/messages/read`);
export const downloadSupportFileApi = (id) => api.get(`${base}/attachments/${id}`, { responseType: "blob" });
export const getSupportTokenApi = () => api.get(`${base}/token`);
