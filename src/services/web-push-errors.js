const stageMessageKeys = {
  "service-worker": "web_push_worker_failed",
  "firebase-token": "web_push_token_failed",
  "notification-auth": "web_push_auth_failed",
  "push-register": "web_push_registration_failed",
  "push-remove": "web_push_registration_failed",
  "profile-load": "web_push_profile_failed",
  "profile-update": "web_push_profile_failed",
};

export async function atWebPushStage(stage, action) {
  try {
    return await action();
  } catch (cause) {
    if (cause?.webPushStage) throw cause;
    const error = new Error(cause?.message || "web_push_failed", { cause });
    error.webPushStage = stage;
    throw error;
  }
}

function requestUrl(config) {
  if (typeof config?.url !== "string") return null;
  try {
    const url = new URL(config.url);
    // Do not log credentials, query strings or fragments, which may contain tokens.
    return `${url.origin}${url.pathname}`;
  } catch {
    return config.url.split(/[?#]/)[0];
  }
}

export function describeWebPushError(error) {
  const cause = error?.cause || error;
  const stage = error?.webPushStage || "unknown";
  const message = error?.message || "web_push_failed";
  return {
    messageKey: /^web_push_[a-z_]+$/.test(message)
      ? message
      : stageMessageKeys[stage] || "web_push_failed",
    stage,
    code: cause?.code || cause?.name || "Error",
    status: cause?.response?.status || null,
    requestUrl: requestUrl(cause?.config),
    method: typeof cause?.config?.method === "string" ? cause.config.method.toUpperCase() : null,
    message,
  };
}
