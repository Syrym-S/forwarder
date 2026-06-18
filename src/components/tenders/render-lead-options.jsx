import { Box, Chip, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";

function formatMoney(value) {
  if (value === null || value === undefined || value === "") {
    return "Цена не указана";
  }

  return `${Number(value).toLocaleString("ru-RU")} KZT`;
}

const RenderLeadOptions = ({ option, ...props }) => {
  return (
    <Box
      component="li"
      {...props}
      sx={{
        m: 1,
        border: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0.5,
        py: 1.2,
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography fontWeight={700}>{option?.from || ""}</Typography>-
        <Typography fontWeight={700}>{option?.to || ""}</Typography>
      </Box>
      <Typography fontWeight={700}>
        {option.title || option.label || `Лид #${option.id}`}
      </Typography>

      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        Груз: {option.cargo || "Не указан"}
      </Typography>

      {/* {option.forwarder && (
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          Экспедитор: {option.forwarder}
        </Typography>
      )} */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mt: 0.5,
        }}
      >
        {option.status && (
          //   <Chip size="small" label={option.status} sx={{ height: 22 }} />
          <RenderStatus status={option.status} />
        )}

        <Chip label={formatMoney(option.price)} />
      </Box>
    </Box>
  );
};

export default RenderLeadOptions;
