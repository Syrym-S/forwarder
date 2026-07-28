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

export async function getLegalDocumentsApi() {
  const response = await api.get(`forwarder/profile/v1/documents`);

  return response.data;
}

export async function uploadLegalDocumentsApi(
  registrationDocumentsToUpload,
  employerDocumentToUpload,
) {
  const formData = new FormData();

  if (registrationDocumentsToUpload) {
    formData.append("registration_document", registrationDocumentsToUpload[0]);
    formData.append(
      "registration_document_name",
      "Документ о регистрации юридического лица",
    );
  }
  if (employerDocumentToUpload) {
    formData.append("employer_document", employerDocumentToUpload[0]);
    formData.append(
      "employer_document_name",
      "Документ о трудоустройстве сотрудника с правам подписи или приказ о назначение первого руководителя",
    );
  }

  const response = await api.post(
    `forwarder/profile/v1/documents/upload`,
    formData,
  );

  return response.data;
}
