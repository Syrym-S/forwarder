import dayjs from "dayjs";

export const useTenderDefaultValues = (form) => {
  return {
    lead_id: form?.lead?.id,
    public_date_time: dayjs(form?.public_date_time).format("YYYY-MM-DD"),
    end_date_time: dayjs(form?.end_date_time).format("YYYY-MM-DD"),
    type: "shipper",
    publication_type: form?.publication_type === "public",
    max_participants: form?.max_participants,
  };
};
