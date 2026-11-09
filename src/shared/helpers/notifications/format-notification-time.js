import dayjs from "dayjs";

export function formatNotificationTime(createdAt, language, now = Date.now()) {
  const value = createdAt?.date ?? createdAt;
  if (value == null || value === "") return null;

  const date = dayjs(value);
  if (!date.isValid()) return null;

  const locale = language || "ru";
  const elapsedSeconds = Math.max(0, Math.floor((now - date.valueOf()) / 1000));
  const relative = new Intl.RelativeTimeFormat(locale, {
    numeric: elapsedSeconds < 60 ? "auto" : "always",
  });
  let label;

  if (elapsedSeconds < 60) {
    label = relative.format(0, "second");
  } else if (elapsedSeconds < 3600) {
    label = relative.format(-Math.floor(elapsedSeconds / 60), "minute");
  } else if (elapsedSeconds < 86400) {
    label = relative.format(-Math.floor(elapsedSeconds / 3600), "hour");
  } else if (elapsedSeconds < 604800) {
    label = relative.format(-Math.floor(elapsedSeconds / 86400), "day");
  } else {
    label = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      ...(date.year() !== dayjs(now).year() ? { year: "numeric" } : {}),
    }).format(date.toDate());
  }

  return {
    label,
    dateTime: date.toISOString(),
    title: new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date.toDate()),
  };
}
