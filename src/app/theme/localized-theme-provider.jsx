import { useLayoutEffect, useMemo } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { arSA, enUS, kkKZ, ruRU, urPK } from "@mui/material/locale";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { useTranslation } from "react-i18next";
import { prefixer } from "stylis";
import { theme } from "./theme";

const locales = { ar: arSA, en: enUS, ru: ruRU, kk: kkKZ, ur: urPK };
const ltrCache = createCache({ key: "muiltr" });
const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function LocalizedThemeProvider({ children }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || "ru";
  const direction = i18n.dir(language);
  const localizedTheme = useMemo(
    () => createTheme(theme, locales[language] || ruRU, { direction }),
    [language, direction],
  );

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  return (
    <CacheProvider value={direction === "rtl" ? rtlCache : ltrCache}>
      <ThemeProvider theme={localizedTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
