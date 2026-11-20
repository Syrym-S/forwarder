export const languageParser = (lang) => {
  switch (lang) {
    case "kz":
    case "kk":
      return "kk_KK";
    case "ru":
      return "ru_RU";
    case "en":
      return "en_EN";
    case "by":
    case "be":
      return "be_BY";
    default:
      return "ru_RU";
  }
};
