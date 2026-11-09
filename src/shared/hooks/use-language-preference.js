import { useTranslation } from "react-i18next";
import { useOptionsStore } from "../../app/store/options";
import { useProfileStore } from "../../app/store/profile/profile-store";
import { INTERFACE_LANGUAGES } from "../const/languages";

export function useLanguagePreference() {
  const { i18n } = useTranslation();
  const availableLanguages = useOptionsStore((state) => state.languages);
  const isSaving = useProfileStore((state) => state.isLanguageSaving);
  const error = useProfileStore((state) => state.languageSaveError);
  const changeLanguage = useProfileStore((state) => state.changeLanguage);
  const availableCodes = new Set(
    availableLanguages.map(({ code }) => code === "kz" ? "kk" : code),
  );
  const languages = INTERFACE_LANGUAGES.filter(
    ({ code }) => availableCodes.size === 0 || availableCodes.has(code),
  );

  return {
    languages,
    currentLanguage: i18n.resolvedLanguage || "ru",
    isSaving,
    error,
    changeLanguage,
  };
}
