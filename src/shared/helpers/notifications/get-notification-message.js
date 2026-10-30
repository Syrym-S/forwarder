const messageVariants = {
  "shipping.loading_started": ["confirmation"],
  "shipping.finished": ["acts_signed"],
  "factor.line_approved": ["limit_approved"],
};

function matchMessage(template, message) {
  const names = [];
  const pattern = template.split(/(\{\{\w+\}\})/).map((part) => {
    const variable = part.match(/^\{\{(\w+)\}\}$/);
    if (variable) {
      names.push(variable[1]);
      return "(.+?)";
    }
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  }).join("");
  const match = message.trim().match(new RegExp(`^${pattern}$`, "u"));
  return match ? Object.fromEntries(names.map((name, index) => [name, match[index + 1]])) : null;
}

function getNotificationText(notification, i18n, field) {
  const original = typeof notification?.[field] === "string" ? notification[field] : "";
  const message = original || (field === "theme" ? i18n.t("ui.notification") : "");
  // Find the longest known event name; trailing IDs may have any format.
  const parts = String(notification?.type || "").trim().split(".");
  while (parts.length && !i18n.exists(`notifications.${parts.join(".")}.${field}`)) {
    parts.pop();
  }
  const type = parts.join(".");
  if (!type) return message;
  const key = `notifications.${type}.${field}`;

  const variants = messageVariants[type] || [];
  const messageKeys = [type, ...variants.map((variant) => `${type}_${variant}`)];
  const languages = new Set([i18n.resolvedLanguage, "ru", "en", "kk"]);
  let baseTemplate;

  // Recover substituted values and distinguish messages that share one type.
  for (const language of languages) {
    if (!language) continue;
    const messages = i18n.getResource(language, "translation", "notifications") || {};
    baseTemplate ??= messages[type]?.[field];
    for (const messageKey of messageKeys) {
      const template = messages[messageKey]?.[field];
      if (typeof template !== "string") continue;
      const values = matchMessage(template, message);
      if (values) {
        return i18n.t(`notifications.${messageKey}.${field}`, { ...values, defaultValue: message });
      }
    }
  }

  // An unrecognised variant must not change the meaning of a notification.
  if (variants.length && message) return message;

  const values = {
    num: notification?.num ?? notification?.params?.num,
    name: notification?.name ?? notification?.params?.name,
  };
  // Entity IDs in type are not the displayed lead number; never invent it.
  const requiredValues = [...String(baseTemplate || "").matchAll(/\{\{(\w+)\}\}/g)];
  if (requiredValues.some(([, name]) => values[name] == null || values[name] === "")) return message;
  return i18n.t(key, { ...values, defaultValue: message });
}

export function getNotificationMessage(notification, i18n) {
  return getNotificationText(notification, i18n, "message");
}

export function getNotificationTheme(notification, i18n) {
  return getNotificationText(notification, i18n, "theme");
}
