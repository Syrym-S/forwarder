import dayjs from "dayjs";
import { moneySpacingFormat } from "../money-spacing.js";

export const getFactoringLinePath = (line) => {
  const id = String(line.id);
  const company = [line.factor?.company_bin, line.factor?.company_name]
    .filter(Boolean)
    .join("-") || id;

  return `/factoring-lines/${encodeURIComponent(id)}/${encodeURIComponent(company)}`;
};

export const getFactoringLineUsage = ({ summ_current, summ_max }) => {
  const current = Number(summ_current);
  const limit = Number(summ_max);
  if (!Number.isFinite(current) || !Number.isFinite(limit) || limit <= 0) return 0;

  const percent = Math.round((current / limit) * 100);
  return Number.isFinite(percent) ? Math.max(0, percent) : 0;
};

export const getFactoringLineDate = (value) => {
  const raw = value instanceof Date ? value : value?.date ?? value;
  if (!raw) return null;
  const date = dayjs(raw);
  return date.isValid() ? date.toDate() : null;
};

export const formatFactoringLineDate = (value) => {
  const date = getFactoringLineDate(value);
  return date ? dayjs(date).format("DD.MM.YYYY HH:mm") : "\u2014";
};

export const formatFactoringLineAmount = (value, currency) => {
  if (value == null || value === "") return "\u2014";
  return `${moneySpacingFormat(value)} ${currency || ""}`.trim();
};
