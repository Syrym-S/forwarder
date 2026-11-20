import { useTranslation } from "react-i18next";
import { useOptionsStore } from "../../app/store/options";
import { useProfileStore } from "../../app/store/profile/profile-store";
import { INTERFACE_LANGUAGES } from "../const/languages";
import { normalizeLanguageCode } from "../helpers/normalize-language-code.js";

export function useLanguagePreference() {
  const { i18n } = useTranslation();
  const availableLanguages = useOptionsStore((state) => state.languages);
  const isSaving = useProfileStore((state) => state.isLanguageSaving);
  const error = useProfileStore((state) => state.languageSaveError);
  const saveLanguage = useProfileStore((state) => state.changeLanguage);
  const availableCodes = new Set(
    availableLanguages.map(({ code }) => normalizeLanguageCode(code)),
  );
  const languages = INTERFACE_LANGUAGES.filter(
    ({ code }) => availableCodes.has(code),
  );
  const changeLanguage = (value) => {
    const selectedLanguage = availableLanguages.find(
      ({ code }) => normalizeLanguageCode(code) === normalizeLanguageCode(value),
    );
    if (selectedLanguage) return saveLanguage(selectedLanguage.code);
  };

  return {
    languages,
    currentLanguage: i18n.resolvedLanguage || "ru",
    isSaving,
    error,
    changeLanguage,
  };
}
