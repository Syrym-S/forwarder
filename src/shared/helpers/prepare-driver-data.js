const REQUIRED_FIELDS = ["fio", "iin", "phone", "email"];

export const prepareDriverData = (data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => {
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
