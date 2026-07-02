import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz";

const getNonce = () => window?.APP_DATA?.nonce || "07d1108ceb";

export async function getProfileDataApi() {
  const response = await axios.get(
    `${BASE_URL}/wp-json/forwarder/profile/v1/get`,
    {
      headers: {
        "X-WP-Nonce": getNonce(),
      },
      withCredentials: true,
    },
  );

  return response.data;
}

export async function editProfileApi(payload) {
  const response = await axios.post(
    `${BASE_URL}/wp-json/forwarder/profile/v1/update`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": getNonce(),
      },
      withCredentials: true,
    },
  );

  return response.data;
}

export async function uploadAvatarApi(payload) {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("name", payload.name);
  formData.append("context", payload.context);

  const response = await axios.post(
    `${BASE_URL}/wp-json/forwarder/profile/v1/avatar/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-WP-Nonce": getNonce(),
      },
      withCredentials: true,
    },
  );

  return response.data;
}

export async function deleteAvatarApi() {
  const response = await axios.delete(
    `${BASE_URL}/wp-json/forwarder/profile/v1/avatar`,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-WP-Nonce": getNonce(),
      },
      withCredentials: true,
    },
  );

  return response.data;
}
