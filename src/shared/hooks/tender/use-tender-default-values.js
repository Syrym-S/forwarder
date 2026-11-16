import dayjs from "dayjs";

export const useTenderDefaultValues = (form) => {
  const publicDateTime = form?.public_date_time
    ? dayjs(form.public_date_time)
    : null;
  const endDateTime = form?.end_date_time
    ? dayjs(form.end_date_time)
    : null;
  const formatDateTime = (value, format) =>
    value?.isValid() ? value.format(format) : "";

  return {
    name: form?.name ?? "",
    lead: form?.lead ?? null,
    lead_id: form?.lead?.id,
    public_date: formatDateTime(publicDateTime, "YYYY-MM-DD"),
    public_time: formatDateTime(publicDateTime, "HH:mm"),
    public_date_time: formatDateTime(publicDateTime, "YYYY-MM-DD HH:mm:ss"),
    end_date: formatDateTime(endDateTime, "YYYY-MM-DD"),
    end_time: formatDateTime(endDateTime, "HH:mm"),
    end_date_time: formatDateTime(endDateTime, "YYYY-MM-DD HH:mm:ss"),
    type: "shipper",
    publication_type: form?.publication_type === "public",
    max_participants: form?.max_participants ?? form?.max_participants_count ?? 0,
    participants: form?.participants ?? [],
  };
};
