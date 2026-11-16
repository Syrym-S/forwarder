// General format validation; country-specific plate layouts may differ.
export const CAR_NUMBER_REGEX =
  /^(?=[A-ZА-ЯЁ0-9]{5,12}$)(?=.*[A-ZА-ЯЁ])(?=.*[0-9])[A-ZА-ЯЁ0-9]+$/;

export const normalizeCarNumber = (value) =>
  value.trim().toUpperCase().replace(/[ -]/g, "");
