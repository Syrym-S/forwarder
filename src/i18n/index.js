import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import en from "./locales/en.json";
import kz from "./locales/kz.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";
import tr from "./locales/tr.json";
import ar from "./locales/ar.json";
import zh from "./locales/zh.json";
import uz from "./locales/uz.json";
import ky from "./locales/ky.json";
import ka from "./locales/ka.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import tg from "./locales/tg.json";
import ur from "./locales/ur.json";

const translations = { ru, en, kk: kz, es, pt, tr, ar, zh, uz, ky, ka, fr, de, tg, ur };
const supportedLngs = Object.keys(translations);

const savedLanguage = localStorage.getItem("language");
const language = savedLanguage === "kz" ? "kk" : savedLanguage;

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    Object.entries(translations).map(([code, translation]) => [code, { translation }]),
  ),
  lng: supportedLngs.includes(language) ? language : "ru",
  fallbackLng: "ru",
  supportedLngs,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
