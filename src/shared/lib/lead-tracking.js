function getCredentials(value) {
  const token = typeof value?.token === "string" ? value.token.trim() : "";
  const url = typeof value?.url === "string" ? value.url.trim() : "";
  return token && url ? { token, url } : null;
}

export async function loadLeadTracking({ tracking, requestToken, requestTracking, signal }) {
  const savedAccess = getCredentials(tracking);
  if (savedAccess) {
    try {
      return { access: savedAccess, response: await requestTracking(savedAccess) };
    } catch (error) {
      if (signal?.aborted) throw error;
    }
  }

  const access = getCredentials(await requestToken());
  if (!access) throw new Error("Сервис не вернул токен или URL геотрекинга");
  return { access, response: await requestTracking(access) };
}
