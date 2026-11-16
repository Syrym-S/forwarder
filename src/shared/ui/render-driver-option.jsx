import appI18n from "../../i18n/index.js";
import { Avatar, Box, Chip, Rating, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

export default function renderDriverOption({ key, ...props }, option) {
  const name = option.fio?.trim() || appI18n.t("ui.unnamed");
  const initials = option.fio?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const rating = Number(option.rating);
  const hasRating = Number.isFinite(rating) && rating > 0 && rating <= 5;
  const isBlocked = option.in_black_list === true;
  const phone = option.phone ? String(option.phone).trim() : "";
  const details = [
    {
      icon: PhoneOutlinedIcon,
      label: appI18n.t("ui.phone"),
      value: phone ? (phone.startsWith("+") ? phone : `+${phone}`) : "",
    },
    { icon: BadgeOutlinedIcon, label: appI18n.t("ui.iin"), value: option.iin },
    { icon: EmailOutlinedIcon, label: "Email", value: option.email },
  ].filter(({ value }) => value);

  return (
    <Box
      component="li"
      key={key}
      {...props}
      sx={(theme) => ({
        px: "16px !important",
        py: "14px !important",
        display: "flex !important",
        alignItems: "flex-start !important",
        gap: 1.5,
        minWidth: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shortest,
        }),
        "&:last-child": { borderBottom: 0 },
        "&&.Mui-focused, &&:not([aria-disabled='true']):hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
        "&&[aria-selected='true']": {
          backgroundColor: alpha(theme.palette.primary.main, 0.09),
        },
      })}
    >
      <Avatar
        aria-hidden="true"
        sx={(theme) => ({
          width: 38,
          height: 38,
          mt: 0.25,
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 2,
          color: isBlocked ? "error.main" : "primary.main",
          bgcolor: alpha(
            isBlocked ? theme.palette.error.main : theme.palette.primary.main,
            0.08,
          ),
        })}
      >
        {initials || <PersonOutlineRoundedIcon fontSize="small" />}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "text.primary", overflowWrap: "anywhere" }}>
                {name}
              </Typography>
              {isBlocked && (
                <Chip
                  icon={<BlockOutlinedIcon />}
                  label={appI18n.t("ui.driver_blocked")}
                  color="error"
                  size="small"
                  variant="outlined"
                  sx={{ height: "auto", minHeight: 22, fontSize: 10, "& .MuiChip-label": { py: 0.25, whiteSpace: "normal" }, "& .MuiChip-icon": { fontSize: 14 } }}
                />
              )}
            </Box>
            {option.company_name && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, minWidth: 0 }}>
                <BusinessOutlinedIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
                <Typography title={option.company_name} noWrap sx={{ fontSize: 12, color: "text.secondary" }}>
                  {option.company_name}
                </Typography>
              </Box>
            )}
          </Box>

          {option.vehicle_number && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: { xs: 0.75, sm: 0.4 },
                maxWidth: "100%",
                minWidth: 0,
              }}
            >
              <Typography sx={{ fontSize: 10, lineHeight: 1.4, color: "text.secondary" }}>
                {appI18n.t("ui.vehicle_number")}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  maxWidth: "100%",
                  px: 1,
                  py: 0.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  color: "text.primary",
                }}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 16, color: "primary.main", flexShrink: 0 }} />
                <Typography component="bdi" dir="ltr" sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1.3, overflowWrap: "anywhere" }}>
                  {option.vehicle_number}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mt: 0.75 }}>
          {hasRating ? (
            <>
              <Rating
                value={rating}
                precision={0.1}
                readOnly
                size="small"
                sx={{ fontSize: 15 }}
                getLabelText={(value) =>
                  appI18n.t("ui.rating_out_of_five", { value1: value })
                }
              />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", fontVariantNumeric: "tabular-nums" }}>
                {rating.toLocaleString(appI18n.resolvedLanguage)} / 5
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {appI18n.t("ui.no_ratings_yet")}
            </Typography>
          )}
        </Box>

        {details.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 1.75, rowGap: 0.75, mt: 1 }}>
            {details.map(({ icon, label, value }) => (
              <Box
                key={label}
                title={`${label}: ${value}`}
                sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, maxWidth: "100%" }}
              >
                <Box component={icon} sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0 }} />
                <Typography component="span" noWrap sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }}>
                  {label}:
                </Typography>
                <Typography component="bdi" dir="ltr" noWrap sx={{ fontSize: 12, color: "text.primary", fontVariantNumeric: "tabular-nums" }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
