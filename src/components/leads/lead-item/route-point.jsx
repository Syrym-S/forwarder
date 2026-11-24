import TripOriginIcon from "@mui/icons-material/TripOrigin";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import dayjs from "dayjs";
import RenderType from "../../../shared/ui/render-type";
import StraightOutlinedIcon from "@mui/icons-material/StraightOutlined";

import { useTranslation } from "react-i18next";
import { Box, Chip, Typography } from "@mui/material";

const RoutePoint = ({
  label,
  address,
  status,
  isFrom,
  isTo,
  isWaypoint,
  date,
  showTime = false,
  isPassed,
  type,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      className="lead-route-point"
      data-route-end={isTo || undefined}
      data-passed={isPassed || undefined}
      sx={theme => ({
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        backgroundColor: "background.default",
        [theme.breakpoints.down("sm")]: {
          ".lead-details-page &": {
            position: "relative",
            padding: "0 0 14px",
            paddingInlineStart: "26px",
            border: "0",
            borderRadius: "0",
            background: "transparent",
            "&::before": {
              position: "absolute",
              top: "6px",
              insetInlineStart: "2px",
              width: "12px",
              height: "12px",
              border: "3px solid #518ded",
              borderRadius: "50%",
              background: "#fff",
              content: "\"\""
            },
            "&[data-passed]::before": {
              borderColor: "#24a36b",
              background: "#eaf8f1"
            },
            "&:not([data-route-end])::after": {
              position: "absolute",
              top: "22px",
              bottom: "-4px",
              insetInlineStart: "7px",
              width: "2px",
              borderRadius: "2px",
              background: "#e2e8f0",
              content: "\"\""
            }
          }
        }
      })}
    >
      {/* Верхняя строка */}
      <Box
        className="lead-route-point-heading"
        sx={theme => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.25,
          flexWrap: "wrap",
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              gap: "8px",
              marginBottom: "7px",
              "& .MuiChip-root": {
                height: "auto",
                minHeight: "22px",
                maxWidth: "100%",
                fontSize: "10px",
                fontWeight: "500"
              },
              "& .MuiChip-label": {
                padding: "3px 7px",
                whiteSpace: "normal"
              }
            }
          }
        })}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            {label}
          </Typography>
          {!isFrom && !isTo && <RenderType type={type} size="small" />}
        </Box>

        <Chip
          label={status}
          color={isPassed ? "primary" : "default"}
          size="small"
          variant="outlined"
          sx={{
            height: 24,
            borderRadius: 2,
            bgcolor: "background.paper",
            fontWeight: 600,
            fontSize: 12,
          }}
        />
      </Box>

      <Box
        className="lead-route-point-address"
        sx={theme => ({
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              "& > .MuiSvgIcon-root": {
                display: "none"
              },
              "& > .MuiTypography-root": {
                fontSize: "13px",
                fontWeight: "500",
                lineHeight: "1.45"
              }
            }
          }
        })}
      >
        {isFrom && (
          <TripOriginIcon
            sx={{
              fontSize: 14,
              color: "primary.main",
              flexShrink: 0,
            }}
          />
        )}
        {isTo && (
          <LocationOnOutlinedIcon
            sx={{
              fontSize: 14,
              color: "primary.main",
              flexShrink: 0,
            }}
          />
        )}
        {isWaypoint && (
          <StraightOutlinedIcon
            sx={{
              rotate: "180deg",
              fontSize: 14,
              color: "primary.main",
              flexShrink: 0,
            }}
          />
        )}

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: "text.primary",
            lineHeight: 1.4,

            overflowWrap: "anywhere",
          }}
        >
          {address || t("ui.address_not_specified")}
        </Typography>
      </Box>
      {(date?.start_at || date?.end_at) && (
        <Box
          className="lead-route-point-dates"
          sx={theme => ({
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
                marginTop: "8px",
                "& > .MuiTypography-root": {
                  paddingTop: "0",
                  fontSize: "10px",
                  lineHeight: "1.4"
                },
                "& span": {
                  display: "block",
                  marginTop: "2px",
                  fontSize: "11px",
                  fontVariantNumeric: "tabular-nums"
                }
              }
            }
          })}
        >
          {date?.start_at && (
            <Typography
              sx={{
                pt: 1,
                fontSize: 13,
                color: "text.secondary",
              }}
            >{t("ui.start_date_label")}{" "}
              <Box
                component="span"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                {dayjs(date.start_at).format(showTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY")}
              </Box>
            </Typography>
          )}

          {date?.end_at && (
            <Typography
              sx={{
                pt: 1,
                fontSize: 13,
                color: "text.secondary",
              }}
            >{t("ui.end_date_label")}{" "}
              <Box
                component="span"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                {dayjs(date.end_at).format(showTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY, HH:mm")}
              </Box>
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RoutePoint;
