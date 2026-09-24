import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import RenderStatus from "../../../shared/ui/render-status";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { FINISHED_LEAD_STATUSES } from "../../../shared/const/tenders";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { useEffect } from "react";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";

const LeadHeading = ({ leadData, openEditForm }) => {
  const canBeEdited = !FINISHED_LEAD_STATUSES.includes(leadData.status);

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  const { notification_type } = parserNotificationType;
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const isLoading = useLeadsStore((state) => state.isLoading);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.shipping) {
      getLeadItem(leadData.id);
    }
  }, [newNotification]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
      <Stack spacing={0.5}>
        <Typography component="h1" sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 600, color: "font_color.heading" }}>Перевозка #{leadData.num || "—"}</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Маршрут, участники и документы заявки</Typography>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          {isLoading && <CircularProgress size={14} />}
          <RenderStatus status={leadData.status} />
        </Box>
        {canBeEdited && <Button variant="outlined" startIcon={<EditNoteRoundedIcon />} onClick={openEditForm} sx={{ textTransform: "none", borderRadius: 2, height: 40 }}>Редактировать</Button>}
      </Box>
    </Box>
  );
};

export default LeadHeading;
