const REQUIRED_FIELDS = ["fio", "iin", "phone", "email"];
const ENTREPRENEUR_FIELDS = new Set([
  "company_name",
  "director_fio",
  "company_bin",
  "legal_address",
  "registration_document",
  "registration_document_name",
  "employer_document",
  "employer_document_name",
]);

export const prepareDriverData = (data) => {
  const isIp = data.is_ip !== false;
  return Object.fromEntries(
    Object.entries({ ...data, is_ip: isIp }).filter(([key, value]) => {
      if (!isIp && ENTREPRENEUR_FIELDS.has(key)) {
        return false;
      }
      if (REQUIRED_FIELDS.includes(key)) {
        return true;
      }

      if (typeof value === "boolean") {
        return true;
      }

      return value !== "" && value !== null && value !== undefined;
    }),
  );
};
