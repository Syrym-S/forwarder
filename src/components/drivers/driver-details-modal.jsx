import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import InfoItem from "../../shared/ui/info-item";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import ContactValue from "../../shared/ui/contact-value";
import ParticipantLeads from "../../shared/ui/participant-leads";
import ParticipantDetailsSkeleton from "../../shared/ui/participant-details-skeleton";

const infoGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1,
  "& .MuiTypography-root": { overflowWrap: "anywhere" },
};
const booleanLabel = (value, yes, no) =>
  value === true ? yes : value === false ? no : null;

const DriverInfoSection = ({ title, icon, children }) => (
  <Paper component="section" variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      {icon}
      <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const DriverDetailsModal = ({ selectedDriver, handleClear }) => {
  const { t } = useTranslation();
  const driverDetails = useDriverStore((state) => state.driverDetails);
  const isDetailsLoading = useDriverStore((state) => state.isDetailsLoading);
  const error = useDriverStore((state) => state.error);
  const isLoading = isDetailsLoading || (!driverDetails && !error);
  const name =
    driverDetails?.fio || selectedDriver?.fio || t("ui.full_name_not_specified");
  const leads = Array.isArray(driverDetails?.leads) ? driverDetails.leads : [];

  return (
    <Dialog
      open={!!selectedDriver}
      onClose={handleClear}
      maxWidth="lg"
      fullWidth
      aria-label={t("ui.driver")}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            m: { xs: 1.5, sm: 4 },
            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
            height: "min(860px, calc(100dvh - 64px))",
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "calc(100dvh - 64px)" },
          },
        },
      }}
    >
      <TooltipIconButton
        title={t("ui.close")}
        aria-label={t("ui.close_driver_details")}
        onClick={handleClear}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <CloseRoundedIcon />
      </TooltipIconButton>
      {!isLoading && !driverDetails ? (
        <Alert severity="error" sx={{ m: 3, mt: 7 }}>
          {t("dashboard.loading_error")}
        </Alert>
      ) : (
        <DialogContent
          aria-busy={isLoading}
          sx={{
            p: 0,
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "420px minmax(0, 1fr)",
            },
            minHeight: 0,
            overflowY: { xs: "auto", md: "hidden" },
          }}
        >
          {isLoading ? (
            <ParticipantDetailsSkeleton sectionFieldCounts={[4, 2, 4]} />
          ) : (
            <>
              <Box
                component="aside"
                aria-labelledby="driver-details-title"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: { xs: 2, sm: 3 },
                  minWidth: 0,
                  overflowY: { md: "auto" },
                  borderRight: { md: "1px solid" },
                  borderBottom: { xs: "1px solid", md: 0 },
                  borderColor: { xs: "divider", md: "divider" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    pr: { xs: 4, md: 0 },
                  }}
                >
                  <Avatar
                    src={driverDetails.avatar || undefined}
                    alt={name}
                    sx={{
                      width: 72,
                      height: 72,
                      minWidth: 72,
                      minHeight: 72,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      objectFit: "cover",
                    }}
                  >
                    {name.trim().charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography variant="caption" color="text.secondary">
                      {t("ui.driver")}
                    </Typography>
                    <Typography
                      id="driver-details-title"
                      component="h2"
                      sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}
                    >
                      {name}
                    </Typography>
                  </Box>
                </Box>

                <DriverInfoSection
                  icon={<PersonOutlineRoundedIcon color="primary" />}
                  title={t("ui.driver_personal_details")}
                >
                  <Box sx={infoGridSx}>
                    <InfoItem label={t("ui.full_name")} value={driverDetails.fio || null} />
                    <InfoItem label={t("ui.iin")} value={driverDetails.iin || null} />
                    <InfoItem
                      label={t("ui.residency_status")}
                      value={booleanLabel(
                        driverDetails.is_foreigner,
                        t("ui.foreign_national"),
                        t("ui.citizen"),
                      )}
                    />
                    <InfoItem label={t("ui.rating")} value={driverDetails.rating ?? null} />
                  </Box>
                </DriverInfoSection>

                <DriverInfoSection
                  icon={<ContactPhoneOutlinedIcon color="primary" />}
                  title={t("ui.contact_details")}
                >
                  <Box sx={infoGridSx}>
                    <InfoItem
                      label={t("ui.phone")}
                      value={driverDetails.phone ? (
                        <ContactValue value={driverDetails.phone} type="phone" />
                      ) : null}
                    />
                    <InfoItem
                      label="Email"
                      value={driverDetails.email ? (
                        <ContactValue value={driverDetails.email} type="email" />
                      ) : null}
                    />
                  </Box>
                </DriverInfoSection>

                <DriverInfoSection
                  icon={<BusinessOutlinedIcon color="primary" />}
                  title={t("ui.company_details")}
                >
                  <Box sx={infoGridSx}>
                    <InfoItem
                      label={t("ui.company_name")}
                      value={driverDetails.company_name || null}
                    />
                    <InfoItem
                      label={t("ui.director_fio")}
                      value={
                        (driverDetails.director_fio ?? selectedDriver?.director_fio) || null
                      }
                    />
                    <InfoItem label={t("ui.bin")} value={driverDetails.company_bin || null} />
                    <InfoItem
                      label={t("ui.individual_entrepreneur")}
                      value={booleanLabel(driverDetails.is_ip, t("ui.yes"), t("ui.no"))}
                    />
                  </Box>
                </DriverInfoSection>
              </Box>
              <ParticipantLeads key={selectedDriver?.id} leads={leads} />
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default DriverDetailsModal;
