import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LeadStatus from "../../../shared/ui/lead-status";

import { useTranslation } from "react-i18next";
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

const LeadHeading = ({ leadData, openEditForm, readOnly = false }) => {
  const { t } = useTranslation();
  const { notification_type } = parserNotificationType;

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const isLoading = useLeadsStore((state) => state.isLoading);

  const canBeEdited = !readOnly && !FINISHED_LEAD_STATUSES.includes(leadData.status);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.shipping) {
      getLeadItem(leadData.id);
    }
  }, [newNotification]);

  return (
    <Box
      className="lead-detail-heading"
      sx={theme => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
        [theme.breakpoints.down("sm")]: {
          ".lead-details-page &": {
            padding: "14px",
            gap: "12px",
            marginBottom: "12px",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            background: "#fff"
          }
        }
      })}
    >
      <Stack
        spacing={0.5}
        className="lead-detail-heading-copy"
        sx={theme => ({
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              minWidth: "0",
              width: "100%",
              "& h1": {
                fontSize: "21px",
                fontWeight: "700",
                lineHeight: "1.3",
                overflowWrap: "anywhere"
              },
              "& > p": {
                fontSize: "12px",
                lineHeight: "1.45"
              }
            }
          }
        })}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 22, sm: 26 },
            fontWeight: 600,
            color: "font_color.heading",
          }}
        >{t("ui.lead_number", { value1: leadData.num || "—" })}</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{t("ui.lead_overview_description")}</Typography>
      </Stack>
      <Box
        className="lead-detail-heading-actions"
        sx={theme => ({
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              width: "100%",
              justifyContent: "space-between",
              gap: "8px",
              "& > .MuiButton-root": {
                height: "36px",
                padding: "6px 10px",
                fontSize: "12px",
                borderRadius: "10px"
              }
            }
          }
        })}
      >
        <Box
          className="lead-detail-status"
          sx={theme => ({
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                minWidth: "0",
                padding: "7px 10px",
                borderRadius: "10px",
                background: "#f8fafc"
              }
            }
          })}
        >
          {isLoading && <CircularProgress size={14} />}
          <LeadStatus lead={leadData} />
        </Box>
        {canBeEdited && (
          <Button
            variant="outlined"
            startIcon={<EditNoteRoundedIcon />}
            onClick={openEditForm}
            sx={{ textTransform: "none", borderRadius: 2, height: 40 }}
          >{t("ui.edit")}</Button>
        )}
      </Box>
    </Box>
  );
};

export default LeadHeading;
