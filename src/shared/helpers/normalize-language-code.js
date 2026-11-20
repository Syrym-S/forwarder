export const normalizeLanguageCode = (code) => {
  if (code === "kz") return "kk";
  if (code === "by") return "be";
  return code;
};
