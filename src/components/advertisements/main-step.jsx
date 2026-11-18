import { Box, Button, Stack } from "@mui/material";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import AddRoadRoundedIcon from "@mui/icons-material/AddRoadRounded";
import { useTranslation } from "react-i18next";
import { STEPS } from "../../shared/const/steps";

const MainStep = ({ nextStep }) => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={2}
      sx={{
        "& .MuiButton-root": {
          justifyContent: "flex-start",
          gap: 1,
          px: 2,
          py: 2,
          minHeight: 64,
          borderRadius: 2,
          textTransform: "none",
          textAlign: "start",
          fontSize: 15,
          lineHeight: 1.5,
        },
      }}
    >
      <Button
        onClick={() => nextStep(STEPS.use_exists)}
        variant="outlined"
        fullWidth
        startIcon={<PlaylistAddCheckRoundedIcon />}
      >
        <Box component="span">{t("advertisements.select_existing_lead")}</Box>
      </Button>
      <Button
        onClick={() => nextStep(STEPS.create_new)}
        variant="contained"
        disableElevation
        fullWidth
        startIcon={<AddRoadRoundedIcon />}
      >
        <Box component="span">{t("advertisements.create_new_lead")}</Box>
      </Button>
    </Stack>
  );
};

export default MainStep;
