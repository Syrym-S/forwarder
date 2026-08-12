import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import React from "react";
import { renderLineColor } from "../../shared/helpers/factoring/render-progress-line-color";

const FactoringLineInfo = ({ line }) => {
  const usedPercent =
    line?.summ_max > 0
      ? Math.round((line?.summ_current / line?.summ_max) * 100)
      : 0;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}
    >
      <Stack spacing={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: "#1a1a1a",
            fontSize: "0.7rem",
          }}
        >
          {usedPercent} %
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={usedPercent}
        sx={{
          height: 8,
          borderRadius: 4,
          width: 200,
          backgroundColor: "grey.200",
          "& .MuiLinearProgress-bar": {
            backgroundColor: renderLineColor(usedPercent),
            borderRadius: 4,
          },
        }}
      />
      {/* <Stack spacing={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: "#1a1a1a",
            fontSize: "0.7rem",
          }}
        >
          {line?.summ_free}
          {line?.currency}
        </Typography>
      </Stack> */}
    </Box>
  );
};

export default FactoringLineInfo;
