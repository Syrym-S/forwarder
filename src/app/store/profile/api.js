import { api } from "../../client";

const getNonce = () => window?.APP_DATA?.nonce || "07d1108ceb";

export async function getProfileDataApi() {
  const response = await api.get(`forwarder/profile/v1/get`, {
    headers: {
      "X-WP-Nonce": getNonce(),
    },
    withCredentials: true,
  });

  return response.data;
}

export async function editProfileApi(payload) {
  const response = await api.post(`forwarder/profile/v1/update`, payload);

  return response.data;
}

export async function uploadAvatarApi(payload) {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("name", payload.name);
  formData.append("context", payload.context);

  const response = await api.post(
    `forwarder/profile/v1/avatar/upload`,
    formData,
  );

  return response.data;
}

export async function deleteAvatarApi() {
  const response = await api.delete(`forwarder/profile/v1/avatar`);

  return response.data;
}
