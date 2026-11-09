import dayjs from "dayjs";

export function formatNotificationTime(createdAt, language, now = Date.now()) {
  const value = createdAt?.date ?? createdAt;
  if (value == null || value === "") return null;

  const date = dayjs(value);
  if (!date.isValid()) return null;

  const locale = language === "kz" ? "kk" : language || "ru";
  const today = dayjs(now).startOf("day");
  const dayKey = date.isSame(today, "day")
    ? "notifications.today"
    : date.isSame(today.subtract(1, "day"), "day")
      ? "notifications.yesterday"
      : null;

  return {
    dayKey,
    dateLabel: date.format(date.year() !== today.year() ? "DD.MM.YYYY" : "DD.MM"),
    timeLabel: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date.toDate()),
    dateTime: date.toISOString(),
    title: new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeStyle: "short",
      hourCycle: "h23",
    }).format(date.toDate()),
  };
}
