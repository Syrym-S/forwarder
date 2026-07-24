import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import RenderStatus from "../../../shared/ui/render-status";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function formatLocation(location) {
  return location?.address || "Адрес не указан";
}

const ForwarderTenderItem = ({ tender }) => {
  const navigate = useNavigate();
  const leadData = tender?.lead;

  const handleClick = () => {
    navigate(`/tenders-driver/${tender?.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        p: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        transition: "0.2s ease",
        backgroundColor: "primary.50",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 6px 18px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={`Лид # ${leadData?.id || "—"}`}
            color={"primary"}
            variant={"outlined"}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
            }}
          />

          <Chip
            label={`Дата окончания тендера: ${dayjs(tender?.end_date_time).format("DD-MM-YYYY") || "—"}`}
            color={"primary"}
            variant={"outlined"}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
            }}
          />

          <Chip
            label={
              tender?.publication_type === "public" ? "Публичный" : "Приватный"
            }
            color={"primary"}
            variant={"outlined"}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
            }}
          />

          {leadData?.status && <RenderStatus status={tender?.status} />}
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Откуда
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {formatLocation(leadData?.from_location)}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="caption" color="text.secondary">
            Куда
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {formatLocation(leadData?.to_location)}
          </Typography>
        </Box>

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {formatLeadPrice(lead)}
          </Typography>

          {!hasRoute && (
            <Chip
              label="Нет координат"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box> */}
      </Stack>
    </Box>
  );
};

export default ForwarderTenderItem;
