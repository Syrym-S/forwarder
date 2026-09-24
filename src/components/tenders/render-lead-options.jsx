import { Box, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";

const RenderLeadOptions = ({ option, ...props }) => {
  const from = option.from_location?.address || option.from || "Адрес не указан";
  const to = option.to_location?.address || option.to || "Адрес не указан";
  const title = option.title || option.label || (typeof option.cargo === "string" ? option.cargo : option.cargo?.name);
  const stops = option.waypoints?.length || 0;
  const hasPrice = option.price !== null && option.price !== undefined && option.price !== "" && Number.isFinite(Number(option.price));

  return (
    <Box component="li" {...props}
      sx={{
        px: "16px !important",
        py: "12px !important",
        display: "flex !important",
        flexDirection: "column !important",
        alignItems: "stretch !important",
        gap: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "font_color.heading", minWidth: 0, flex: "1 1 140px", overflowWrap: "anywhere" }}>
          №{option.num || option.id}
          {title && <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}> · {title}</Box>}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.25 }}>
          {option.status && <RenderStatus status={option.status} />}
          {hasPrice && <Typography sx={{ fontSize: 13, fontWeight: 600, color: "font_color.heading" }}>{Number(option.price).toLocaleString("ru-RU")} {option.currency || "KZT"}</Typography>}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "26px minmax(0, 1fr)", columnGap: 1.25, rowGap: 0.75, position: "relative", "&::before": { content: '""', position: "absolute", left: 12, top: 13, bottom: 13, borderLeft: "2px dotted", borderColor: "divider" } }}>
        {[{ letter: "А", address: from }, { letter: "Б", address: to }].map(({ letter, address }, index) => (
          <Box key={letter} sx={{ display: "contents" }}>
            <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "primary.main", color: "common.white", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600, zIndex: 1 }}>{letter}</Box>
            <Box sx={{ minWidth: 0, alignSelf: "center" }}>
              <Typography title={address} noWrap sx={{ fontSize: 13, color: "text.primary", lineHeight: 1.5 }}>{address}</Typography>
              {index === 0 && stops > 0 && <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>Промежуточных точек: {stops}</Typography>}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RenderLeadOptions;
