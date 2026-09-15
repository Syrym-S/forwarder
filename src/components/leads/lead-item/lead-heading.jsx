import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import RenderStatus from "../../../shared/ui/render-status";
import { STATUS } from "../../../shared/const/tenders";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { useEffect } from "react";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";

const LeadHeading = ({ leadData, openEditForm }) => {
  const canBeEdited =
    leadData.status !== STATUS.finished &&
    leadData.status !== STATUS.cancelled &&
    leadData.status !== STATUS.deleted;

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  const { notification_type } = parserNotificationType;
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.shipping) {
      getLeadItem(leadData.id);
    }
  }, [newNotification]);

  return (
    <Box
      spacing={0.5}
      sx={{
        display: "flex",
        alignItems: {
          xs: "start",
          sm: "center",
        },
        gap: "10px",
        justifyContent: "space-between",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            Информация о лиде
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Подробные данные по заявке
          </Typography>
        </Stack>
        {canBeEdited && (
          <EditNoteRoundedIcon
            onClick={openEditForm}
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
              fontSize: "2.5rem",
              color: "primary.main",
              cursor: "pointer",
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          py: "10px",
          alignItems: "center",
          justifyContent: { xs: "space-between", sm: "end" },
          gap: {
            xs: "3px",
            sm: "10px",
          },
          width: {
            xs: "100%",
            sm: "40%",
          },
        }}
      >
        <Chip
          label={`Лид #${leadData.num}`}
          variant="outlined"
          sx={{
            color: "primary.main",
            borderColor: "primary.main",
            fontWeight: 600,
          }}
        />

        <RenderStatus status={leadData.status} />
        <Stack
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Tooltip title="Редактировать">
            {canBeEdited && (
              <EditNoteRoundedIcon
                onClick={openEditForm}
                sx={{
                  fontSize: "2.5rem",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              />
            )}
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};

export default LeadHeading;
