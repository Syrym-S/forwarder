import { api } from "../../client";

const path = "/forwarder/v1/complaints";

export const getComplaintsApi = () => api.get(path);
export const getComplaintTargetsApi = () => api.get(`${path}/targets`);
export const getComplaintApi = (id) => api.get(`${path}/${encodeURIComponent(id)}`);
export const getComplaintFileApi = (id, index) => api.get(
  `${path}/${encodeURIComponent(id)}/files/${encodeURIComponent(index)}`,
  { responseType: "blob" },
);

export function createComplaintApi({ request, target, files }) {
  const payload = new FormData();
  payload.append("request", request.trim());
  if (target) {
    payload.append("target_type", target.type);
    payload.append("target_id", target.id);
  }
  files.forEach((file) => payload.append("files[]", file));
  return api.post(path, payload);
}
