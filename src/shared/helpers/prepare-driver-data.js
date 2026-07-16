const REQUIRED_FIELDS = ["fio", "iin", "phone", "email"];

export const prepareDriverData = (data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => {
      if (REQUIRED_FIELDS.includes(key)) {
        return true;
      }

      // boolean всегда отправляем
      if (typeof value === "boolean") {
        return true;
      }

      // остальные только если заполнены
      return value !== "" && value !== null && value !== undefined;
    }),
  );
};
