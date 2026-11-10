export const handlePhonePaste = (event, onChange) => {
  const digits = event.clipboardData.getData("text").replace(/\D/g, "");
  const nationalNumber =
    digits.length === 11 && /^[78]/.test(digits) ? digits.slice(1) : digits;

  // Leave partial numbers and other country codes to the input's normal handling.
  if (nationalNumber.length !== 10) return;

  event.preventDefault();
  onChange(
    `+7 (${nationalNumber.slice(0, 3)}) ${nationalNumber.slice(3, 6)}-${nationalNumber.slice(6, 8)}-${nationalNumber.slice(8)}`,
  );
};
