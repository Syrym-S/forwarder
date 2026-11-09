import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import RootLayout from "../../components/layout/root-layout";
import WebPushSettings from "../../components/profile/web-push-settings";
import { useLanguagePreference } from "../../shared/hooks/use-language-preference";

export default function Settings() {
  const { t } = useTranslation();
  const { languages, currentLanguage, isSaving, error, changeLanguage } =
    useLanguagePreference();

  return (
    <RootLayout withoutDataCheck>
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 720, mx: "auto" }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: 600, color: "font_color.heading" }}
        >
          {t("menu.settings")}
        </Typography>
        <Paper
          component="section"
          variant="outlined"
          aria-labelledby="settings-language-title"
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: "none" }}
        >
          <Typography
            component="h2"
            id="settings-language-title"
            sx={{ fontSize: 18, fontWeight: 600, color: "font_color.heading" }}
          >
            {t("settings.language_title")}
          </Typography>
          <Typography
            id="settings-language-description"
            sx={{
              mt: 1,
              mb: 3,
              fontSize: 14,
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {t("settings.language_description")}
          </Typography>
          {error && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  disabled={isSaving}
                  onClick={() => changeLanguage(currentLanguage)}
                >
                  {t("ui.try_again")}
                </Button>
              }
            >
              {t("settings.language_save_failed")}
            </Alert>
          )}
          <RadioGroup
            name="interface-language"
            value={currentLanguage}
            onChange={(event) => changeLanguage(event.target.value)}
            aria-labelledby="settings-language-title"
            aria-describedby="settings-language-description"
            aria-busy={isSaving}
            sx={{ gap: 0.5 }}
          >
            {languages.map(({ code, label }) => (
              <FormControlLabel
                key={code}
                value={code}
                disabled={isSaving}
                control={<Radio sx={{ p: 1, mr: 0.5 }} />}
                label={
                  <Box sx={{ py: 0.5 }}>
                    <Typography
                      component="span"
                      lang={code}
                      dir="auto"
                      sx={{
                        display: "block",
                        fontSize: 16,
                        color: "font_color.heading",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      component="span"
                      dir="ltr"
                      sx={{
                        display: "block",
                        mt: 0.25,
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {code.toUpperCase()}
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  minHeight: 72,
                  borderRadius: 2,
                  bgcolor:
                    code === currentLanguage
                      ? "rgba(24, 87, 196, 0.08)"
                      : "transparent",
                  transition: "background-color 150ms",
                  "&:hover": { bgcolor: "action.hover" },
                  "&:has(.Mui-focusVisible)": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              />
            ))}
          </RadioGroup>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: "none" }}
        >
          <WebPushSettings />
        </Paper>
      </Stack>
    </RootLayout>
  );
}
