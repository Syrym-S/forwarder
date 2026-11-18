import dayjs from "dayjs";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing.js";

export const formatAdvertisementDate = (value) =>
  value && dayjs(value).isValid() ? dayjs(value).format("DD.MM.YYYY HH:mm") : "—";

export const formatAdvertisementPrice = (value, currency) =>
  value !== null && value !== undefined && value !== ""
    ? `${moneySpacingFormat(value)}${currency ? ` ${currency}` : ""}`
    : "—";

export const getAdvertisementAddress = (location) => location?.address || location?.city || "—";

export const getAdvertisementDetailsPath = (id, source = "my") =>
  `/advertisements/${source}/${encodeURIComponent(id)}`;

export const getAdvertisementStart = (lead) =>
  lead?.point_schedules?.find((schedule) =>
    schedule.point_index !== null && schedule.point_index !== "" && Number(schedule.point_index) === 0,
  )?.start_at;
