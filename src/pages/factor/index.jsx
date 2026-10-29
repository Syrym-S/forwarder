import { useTranslation } from "react-i18next";
import RootLayout from "../../components/layout/root-layout";
import FactorLineForm from "../../features/factor-line/factor-line-form";
import ViewTabs from "../../shared/ui/view-tabs";
import FactorLineContainer from "../../components/factor-line/factor-line-container";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useFactorStore } from "../../app/store/factor/factor-store";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";

const Factor = () => {
  const { t } = useTranslation();
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const getFactoringsLine = useFactorStore((state) => state.getFactoringsLine);

  const [view, setView] = useState(VIEWS.table);
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  useEffect(() => {
    getFactoringsLine();
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.factor) {
      getFactoringsLine();
    }
  }, [newNotification, notification_type, getFactoringsLine]);

  return (
    <RootLayout withoutDataCheck>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            сolor: "font_color.heading",
          }}
        >{t("ui.factoring_lines")}</Typography>

        <Typography color="text.secondary" fontSize={14}>{t("ui.factoring_line_requests")}</Typography>
      </Box>
      <Box
        sx={{
          py: 1,
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          handleOpenForm={handleOpenForm}
          withoutKanban
        />

        {openForm && (
          <FactorLineForm open={openForm} setOpenForm={setOpenForm} />
        )}
      </Box>

      <FactorLineContainer view={view} />
    </RootLayout>
  );
};

export default Factor;
