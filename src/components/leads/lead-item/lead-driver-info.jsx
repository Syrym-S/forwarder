import appI18n from "../../../i18n/index.js";
import Section from "./lead-detail-section";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import EmptyInfo from "../../../shared/ui/empty/empty-info";
import LeadParticipantSkeleton from "../skeleton/lead-participant-skeleton";

import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Rating,
  Typography,
} from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";
import { useState } from "react";

const LeadDriverInfo = ({
  leadData,
  canDetach = false,
  setRatingLead,
  hideRatingAction = false,
}) => {
  const { t } = useTranslation();

  const [isDetaching, setIsDetaching] = useState(false);

  const detachDriver = useLeadsStore((state) => state.detachDriver);
  const isDriverDetachLoading = useLeadsStore(
    (state) => state.isDriverDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const driver = leadData?.driver;
  const isDriverRated = !!leadData?.driver_rate;
  const driverRate = Number(leadData?.driver_rate);
  const hasDriverRate =
    Number.isFinite(driverRate) && driverRate >= 1 && driverRate <= 5;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;
  const isFinished = leadData?.status === STATUS.finished;

  const handleDetachDriver = async () => {
    setIsDetaching(true);
    try {
      await detachDriver(leadData?.id);
      await getLeadItem(leadData?.id);
    } finally {
      setIsDetaching(false);
    }
  };

  const handleOpenRateModal = () => {
    setRatingLead({ id: leadData.id, driver: leadData.driver });
  };

  if (isDriverDetachLoading || isDetaching)
    return (
      <Section title={t("ui.driver")} icon={<PersonOutlinedIcon color="primary" />}>
        <LeadParticipantSkeleton />
      </Section>
    );

  if (!driver?.fio && !driver?.id)
    return (
      <Section title={t("ui.driver")} icon={<PersonOutlinedIcon color="primary" />}>
        <EmptyInfo
          label={t("ui.driver_not_specified")}
          subLabel={t("ui.driver_required_to_start_trip")}
        />
      </Section>
    );

  return (
    <Section
      title={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "font_color.heading",
              fontSize: 16,
            }}
          >{t("ui.driver")}</Typography>

          {!hideRatingAction && !isDriverRated && isFinished && (
            <Button
              onClick={handleOpenRateModal}
              startIcon={<StarBorderRoundedIcon />}
              color="warning"
              size="small"
              sx={{ ml: 1, textTransform: "none" }}
            >{t("ui.rate_driver_2")}</Button>
          )}
        </Box>
      }
      icon={<PersonOutlinedIcon color="primary" />}
    >
      {isAddDriverStatus && canDetach && (
        <PrimaryButton
          color="error"
          variant="outlined"
          onClick={handleDetachDriver}
          text={t("ui.unassign_driver")}
        />
      )}
      <Box
        className="lead-party-fields"
        sx={theme => ({
          py: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))"
          },
          gap: 1.5,
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
              padding: "0"
            }
          }
        })}
      >
        <InfoItem label={t("ui.driver_id")} value={driver.id} />
        <InfoItem
          className="lead-field-wide lead-driver-name"
          label={t("ui.full_name")}
          value={driver.fio}
          sx={theme => ({
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                gridColumn: "1 / -1",
                order: "-2"
              }
            }
          })}
        />
        <InfoItem
          label={t("ui.vehicle_number")}
          value={driver.vehicle_number || null}
        />
        <InfoItem
          className="lead-field-wide lead-driver-rating"
          label={t("ui.your_rating")}
          value={
            hasDriverRate ? (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Rating
                  value={driverRate}
                  precision={0.5}
                  readOnly
                  size="small"
                  getLabelText={(value) => t("ui.rating_out_of_five", { value1: value })}
                />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {driverRate.toLocaleString(appI18n.resolvedLanguage)} / 5
                </Box>
              </Box>
            ) : (
              t("ui.no_ratings_yet_2")
            )
          }
          sx={theme => ({
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                gridColumn: "1 / -1",
                order: "1"
              }
            }
          })}
        />
        {driver.phone && (
          <InfoItem
            className="lead-field-wide lead-driver-phone"
            label={t("ui.phone")}
            value={driver.phone}
            sx={theme => ({
              [theme.breakpoints.down("sm")]: {
                ".lead-details-page &": {
                  gridColumn: "1 / -1",
                  order: "-1"
                }
              }
            })}
          />
        )}
        {leadData?.driver_rate_comment?.trim() && (
          <Box
            className="lead-driver-comment"
            sx={theme => ({
              gridColumn: "1 / -1",
              minWidth: 0,
              [theme.breakpoints.down("sm")]: {
                ".lead-details-page &": {
                  order: "2"
                }
              }
            })}
          >
            <InfoItem
              label={t("ui.forwarder_comment")}
              value={
                <Box
                  component="span"
                  sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                >
                  {leadData.driver_rate_comment}
                </Box>
              }
            />
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default LeadDriverInfo;
