import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { editProfileApi } from "../../app/store/profile/api";

const LanguageSelect = ({ languages = [] }) => {
  const { t, i18n } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    () => localStorage.getItem("language") || i18n.language || "ru",
  );
  const selectedLanguage = languages.some(({ code }) => code === currentLanguage)
    ? currentLanguage
    : "";

  const handleLanguageChange = async (event) => {
    const language = event.target.value;
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);

    setIsSaving(true);
    try {
      await editProfileApi({ language });
    } catch (error) {
      console.error("Failed to save profile language", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Select
      value={selectedLanguage}
      onChange={handleLanguageChange}
      disabled={isSaving || languages.length === 0}
      displayEmpty
      renderValue={(code) => (code || currentLanguage).toUpperCase()}
      size="small"
      inputProps={{ "aria-label": t("ui.select_language") }}
      MenuProps={{
        slotProps: {
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(22, 36, 62, 0.12)",
            },
          },
        },
      }}
      sx={{
        alignSelf: "center",
        minWidth: 64,
        height: 36,
        borderRadius: 2,
        backgroundColor: "background.paper",
        color: "text.primary",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.04em",
        transition: "background-color 0.2s, box-shadow 0.2s",
        "& .MuiSelect-select": {
          pl: 1.25,
          pr: "26px",
        },
        "& .MuiSelect-icon": {
          right: 4,
          fontSize: 20,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "divider",
        },
        "&:hover": {
          backgroundColor: "action.hover",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
        },
        "&.Mui-focused": {
          boxShadow: "0 0 0 3px rgba(24, 87, 196, 0.12)",
        },
      }}
    >
      {languages.map(({ code, label, name }) => (
        <MenuItem
          key={code}
          value={code}
          sx={{ fontSize: 13, fontWeight: 600 }}
        >
          {label || name || code}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelect;
