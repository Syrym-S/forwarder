export const isDraftLead = (lead) =>
  lead?.is_draft === true || lead?.is_draft === 1 || lead?.is_draft === "1";
