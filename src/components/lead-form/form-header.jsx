import { useTranslation } from "react-i18next";
import { Box, Chip, DialogTitle, IconButton, LinearProgress, Typography } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";

const FormHeader = ({ titleId, isEdit, activeStep, stepsCount, onClose, disabled }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ flexShrink: 0 }}>
      <DialogTitle
        component="div"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 1.5, sm: 2 },
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              id={titleId}
              component="h2"
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },
                fontWeight: 700,
                lineHeight: 1.3,
                overflowWrap: "anywhere",
              }}
            >
              {isEdit ? t("lead_form.edit_route") : t("lead_form.create_route_title")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 12, display: { xs: "none", sm: "block" }, "@media (max-height: 500px)": { display: "none" } }}>{t("lead_form.fill_request_details")}</Typography>
          </Box>

          <Chip
            label={t("lead_form.step_progress", { value1: activeStep, value2: stepsCount })}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 999,
              fontWeight: 600,
              backgroundColor: "rgba(33, 150, 243, 0.04)",
              fontSize: 11,
              flexShrink: 0,
            }}
          />
          <IconButton onClick={onClose} disabled={disabled} aria-label={t("ui.close_form")} sx={{ width: 36, height: 36, flexShrink: 0 }}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <LinearProgress variant="determinate" value={activeStep / stepsCount * 100} sx={{ height: 3, bgcolor: "background.main" }} />
    </Box>
  );
};

export default FormHeader;
