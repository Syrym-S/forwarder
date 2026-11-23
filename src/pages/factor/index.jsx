import { useTranslation } from "react-i18next";
import RootLayout from "../../components/layout/root-layout";
import FactorLineForm from "../../features/factor-line/factor-line-form";
import ViewTabs from "../../shared/ui/view-tabs";
import FactorLineContainer from "../../components/factor-line/factor-line-container";
import SuccessModal from "../../components/factoring/factoring-form/success-modal";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useFactorStore } from "../../app/store/factor/factor-store";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";

const FactoringLines = () => {
  const { t } = useTranslation();
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const getFactoringsLine = useFactorStore((state) => state.getFactoringsLine);
  const lines = useFactorStore((state) => state.factoringsLine);
  const isLoading = useFactorStore((state) => state.isLoading);
  const error = useFactorStore((state) => state.linesError);

  const [view, setView] = useState(VIEWS.table);
  const [openForm, setOpenForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleSuccess = (success) => {
    setShowSuccess(success);
    if (success) {
      setOpenForm(false);
      getFactoringsLine();
    }
  };

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  useEffect(() => {
    getFactoringsLine();
  }, [getFactoringsLine]);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.factor) {
      getFactoringsLine();
    }
  }, [newNotification, notification_type, getFactoringsLine]);

  return (
    <RootLayout
      withoutDataCheck
      sx={{ width: "100%", minWidth: 0, p: { xs: 2, sm: 3 }, pl: { sm: "calc(20vw + 24px)" } }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: 22, sm: 24 },
            color: "font_color.heading",
          }}
        >{t("ui.factoring_lines")}</Typography>

        <Typography color="text.secondary" fontSize={14}>{t("ui.factoring_line_requests")}</Typography>
      </Box>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          handleOpenForm={handleOpenForm}
          withoutKanban
          buttonText={t("ui.create_request_2")}
          sx={{ width: "100%", gap: 2, flexWrap: "wrap" }}
        />

        {openForm && (
          <FactorLineForm open={openForm} setOpenForm={setOpenForm} setSuccessModal={handleSuccess} />
        )}
      </Box>

      <FactorLineContainer view={view} lines={lines} isLoading={isLoading} error={error} onRetry={getFactoringsLine} />
      {showSuccess && <SuccessModal open={showSuccess} setOpen={setShowSuccess} />}
    </RootLayout>
  );
};

export default FactoringLines;
