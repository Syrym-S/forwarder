import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { enUS, kkKZ, ruRU } from "@mui/material/locale";
import { useTranslation } from "react-i18next";
import { theme } from "./theme";

const locales = { en: enUS, ru: ruRU, kk: kkKZ };

export default function LocalizedThemeProvider({ children }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || "ru";
  const localizedTheme = useMemo(
    () => createTheme(theme, locales[language] || ruRU),
    [language],
  );

  return <ThemeProvider theme={localizedTheme}>{children}</ThemeProvider>;
}
