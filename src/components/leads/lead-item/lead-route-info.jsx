import { useTranslation } from "react-i18next";
import Section from "./lead-detail-section";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import RoutePoint from "./route-point";
import { Box } from "@mui/material";
import InfoItem from "../../../shared/ui/info-item";

const LeadRouteInfo = ({ leadData }) => {
  const { t } = useTranslation();
  const waypoints = leadData?.waypoints || [];
  const pointSchedules = leadData?.point_schedules || [];

  return (
    <Section title={t("ui.route")} icon={<RouteOutlinedIcon color="primary" />}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          gap: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          width: "100%",
          minWidth: 0,

          px: {
            xs: 0,
            sm: 0.5,
            md: 0,
          },
        }}
      >
        <RoutePoint
          label={t("ui.origin")}
          isFrom
          address={leadData?.from_location?.address || t("ui.not_specified")}
          isPassed={leadData?.from_location?.is_passed}
          status={
            leadData?.from_location?.is_passed
              ? t("ui.point_passed")
              : t("ui.point_not_passed")
          }
          date={pointSchedules[0]}
        />

        {waypoints.map((point, index) => (
          <RoutePoint
            key={point?.id || `${point?.address}-${index}`}
            isPassed={point?.is_passed}
            isWaypoint
            label={t("ui.waypoint_number", { value1: index + 1 })}
            address={point?.address || t("ui.not_specified")}
            status={point?.is_passed ? t("ui.point_passed") : t("ui.point_not_passed")}
            date={pointSchedules[index + 1]}
            type={point.type}
          />
        ))}

        <RoutePoint
          label={t("ui.destination")}
          address={leadData?.to_location?.address || t("ui.not_specified")}
          isTo
          status={
            leadData?.to_location?.is_passed
              ? t("ui.point_passed")
              : t("ui.point_not_passed")
          }
          isPassed={leadData?.to_location?.is_passed}
          date={pointSchedules[waypoints.length + 1]}
        />
        <InfoItem
          label={t("ui.skip_loading_unloading_file_confirmation")}
          value={leadData?.pass_verify === true ? t("ui.enabled") : t("ui.disabled")}
        />
      </Box>
    </Section>
  );
};

export default LeadRouteInfo;
