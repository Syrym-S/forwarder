export const useTenderDefaultValues = (form) => {
  return {
    lead_id: form.laed.id,
    public_date_time: form.public_date_time,
    end_date_time: form.end_date_time,
    type: "shipper",
    publication_type: form.publication_type,
    max_participants: form.max_participants,
  };
};
