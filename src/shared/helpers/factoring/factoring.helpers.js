import appI18n from "../../../i18n/index.js";
export function formatMoney(amount, currency = "KZT") {
  if (amount === null || amount === undefined || amount === "") {
    return appI18n.t("ui.not_specified_2");
  }

  return `${Number(amount).toLocaleString(appI18n.resolvedLanguage)} ${currency || "KZT"}`;
}

export function normalizeLeadsResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
}

export function isFinishedLead(lead) {
  return String(lead?.status || "").toLowerCase() === "finished";
}

export function formatPercent(value) {
  if (value === null || value === undefined || value === "") {
    return appI18n.t("ui.not_specified_2");
  }

  return `${(Number(value) * 100).toFixed(1)}%`;
}

export function formatDate(value) {
  if (!value) {
    return appI18n.t("ui.not_specified_2");
  }

  let dateValue = value;

  if (typeof value === "object") {
    dateValue =
      value.date || value.datetime || value.value || value.created_at || "";

    if (!dateValue) {
      return appI18n.t("ui.not_specified_2");
    }
  }

  const normalizedDateValue =
    typeof dateValue === "string" ? dateValue.replace(" ", "T") : dateValue;

  const date = new Date(normalizedDateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue || appI18n.t("ui.not_specified_2"));
  }

  return date.toLocaleString(appI18n.resolvedLanguage, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getFactoringStatusLabel(status) {
  const labels = {
    new: appI18n.t("ui.new_4"),
    verified_participant: appI18n.t("ui.one_participant_confirmed"),
    await_paid: appI18n.t("ui.awaiting_payment"),
    finished: appI18n.t("ui.completed_2"),
    cancelled: appI18n.t("ui.cancelled"),
  };

  return labels[status] || status || appI18n.t("ui.not_specified_2");
}

export function getFactoringStatusColor(status) {
  const colors = {
    new: "info",
    verified_participant: "warning",
    await_paid: "primary",
    finished: "success",
    cancelled: "error",
  };

  return colors[status] || "default";
}

export function getVerificationLabel(value) {
  return value ? appI18n.t("ui.confirmed") : appI18n.t("ui.not_confirmed");
}

export function getVerificationColor(value) {
  return value ? "success" : "default";
}

export function getCustomerName(customer) {
  return customer?.fullname || customer?.fullName || customer?.name || "—";
}

export function getForwarderName(forwarder) {
  return forwarder?.company_name || forwarder?.companyName || "—";
}
