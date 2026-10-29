import { useTranslation } from "react-i18next";
import { STATUS } from "../const/tenders";
import { Box, Typography } from "@mui/material";

export const RenderStatusContent = ({ label, color = "#518ded" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          flexShrink: 0,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      ></Box>

      <Typography
        sx={{
          color: "#172B4D",
          fontSize: {
            xs: "0.7rem",
            sm: "0.8rem",
          },
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const RenderStatus = ({ status }) => {
  const { t } = useTranslation();
  switch (status) {
    case STATUS.new:
      return (
        <RenderStatusContent
          label={t("dashboard.new")}
          variant="contained"
          color="#51d861"
        />
      );

    case STATUS.active:
      return (
        <RenderStatusContent
          label={t("dashboard.active")}
          variant="outlined"
          color="#49b439"
        />
      );

    case STATUS.cancelled:
      return (
        <RenderStatusContent
          label={t("dashboard.cancelled")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.add_driver:
      return (
        <RenderStatusContent label={t("dashboard.driver_added")} variant="outlined" />
      );

    case STATUS.start_driver:
      return (
        <RenderStatusContent label={t("dashboard.trip_started")} variant="contained" />
      );

    case STATUS.loading:
      return <RenderStatusContent label={t("dashboard.loading_operation")} variant="contaned" />;

    case STATUS.start_loading:
      return <RenderStatusContent label={t("dashboard.loading_operation")} variant="outlined" />;

    case STATUS.verification_loading:
      return (
        <RenderStatusContent
          label={t("dashboard.loading_confirmed")}
          variant="contained"
        />
      );

    case STATUS.start_unloading:
      return <RenderStatusContent label={t("dashboard.unloading_operation")} variant="outlined" />;

    case STATUS.unloading:
      return <RenderStatusContent label={t("dashboard.unloading_operation")} variant="contaned" />;

    case STATUS.verification_unloading:
      return (
        <RenderStatusContent
          label={t("dashboard.unloading_confirmed")}
          variant="outlined"
        />
      );

    case STATUS.finished:
      return (
        <RenderStatusContent
          label={t("dashboard.trip_completed")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.deleted:
      return (
        <RenderStatusContent
          label={t("dashboard.trip_deleted")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.loss:
      return (
        <RenderStatusContent
          label={t("dashboard.lost")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.closed:
      return (
        <RenderStatusContent
          label={t("dashboard.closed")}
          variant="container"
          color="#c60606"
        />
      );

    case STATUS.winning:
      return <RenderStatusContent label={t("dashboard.won")} variant="outlined" />;

    case STATUS.await_paid:
      return (
        <RenderStatusContent label={t("dashboard.awaiting_payment")} variant="outlined" />
      );

    case STATUS.verified_participant:
      return (
        <RenderStatusContent label={t("dashboard.awaiting_confirmation")} variant="outlined" />
      );

    case STATUS.approved:
      return <RenderStatusContent label={t("dashboard.confirmed")} variant="outlined" />;

    case STATUS.emergency_situation:
      return (
        <RenderStatusContent
          label={t("dashboard.emergency")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.finished_emergency_situation:
      return (
        <RenderStatusContent
          label={t("dashboard.emergency_closed")}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.sign_avr:
      return (
        <RenderStatusContent
          label={t("dashboard.awaiting_signatures")}
          variant="outlined"
          color="#d16a16"
        />
      );

    default:
      return <>{t("dashboard.no_status")}</>;
  }
};

export default RenderStatus;
