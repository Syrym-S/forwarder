import Section from "./lead-detail-section";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Rating,
  Typography,
} from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";
import { InfoBadge } from "../../lead-form/info-badge";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

const LeadDriverInfo = ({ leadData, canDetach = false, setRatingLead, hideRatingAction = false }) => {
  const driver = leadData?.driver;
  const isDriverRated = !!leadData?.driver_rate;
  const driverRate = Number(leadData?.driver_rate);
  const hasDriverRate =
    Number.isFinite(driverRate) && driverRate >= 1 && driverRate <= 5;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;
  const isFinished = leadData?.status === STATUS.finished;

  const detachDriver = useLeadsStore((state) => state.detachDriver);
  const isDriverDetachLoading = useLeadsStore(
    (state) => state.isDriverDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const handleDetachDriver = async () => {
    await detachDriver(leadData?.id);
    await getLeadItem(leadData?.id);
  };

  const handleOpenRateModal = () => {
    setRatingLead({ id: leadData.id, driver: leadData.driver });
  };

  if (isDriverDetachLoading)
    return (
      <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      </Section>
    );

  if (!driver?.fio && !driver?.id)
    return (
      <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
        <InfoBadge label={""} value={"Водитель не указан"} />
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
          >
            Водитель
          </Typography>

          {!hideRatingAction && !isDriverRated && isFinished && (
            <Button
              onClick={handleOpenRateModal}
              startIcon={<StarBorderRoundedIcon />}
              color="warning"
              size="small"
              sx={{ ml: 1, textTransform: "none" }}
            >
              Оценить водителя
            </Button>
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
          text="Отвязать водителя"
        />
      )}
      <Box
        sx={{
          py: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <InfoItem label={"ID водителя"} value={driver.id} />
        <InfoItem label={"ФИО"} value={driver.fio} />
        <InfoItem
          label="Ваш оценка"
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
                  getLabelText={(value) => `${value} из 5`}
                />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {driverRate.toLocaleString("ru-RU")} / 5
                </Box>
              </Box>
            ) : (
              "Пока нет оценки"
            )
          }
        />
        {driver.phone && (
          <InfoItem label={"Номер телефона"} value={driver.phone} />
        )}
        {leadData?.driver_rate_comment?.trim() && (
          <Box sx={{ gridColumn: "1 / -1", minWidth: 0 }}>
            <InfoItem
              label="Комментарий экспедитора"
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
