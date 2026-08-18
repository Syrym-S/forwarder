import React, { useEffect } from "react";
import FactoringLineCard from "../../factor-line/factor-line-card";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import RenderErrorContext from "../../../shared/ui/errors/render-error-context";
import { renderLineColor } from "../../../shared/helpers/factoring/render-progress-line-color";

const FactoringSettingsInfoStep = ({ line, approvedLine }) => {
  const isLoading = useFactorStore((state) => state.isLoading);
  const factoringLineDetails = useFactorStore(
    (state) => state.factoringLineDetails,
  );
  const getFactoringLineDetails = useFactorStore(
    (state) => state.getFactoringLineDetails,
  );

  const usedPercent =
    factoringLineDetails?.summ_max > 0
      ? Math.round(
          (factoringLineDetails?.summ_current /
            factoringLineDetails?.summ_max) *
            100,
        )
      : 0;

  useEffect(() => {
    getFactoringLineDetails(line.id);
  }, []);

  if (isLoading)
    return (
      <Stack
        spacing={0.5}
        sx={{
          py: 1,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );

  if (!factoringLineDetails)
    return (
      <Stack
        spacing={0.5}
        sx={{
          py: 1,
        }}
      >
        <RenderErrorContext error={"Факторинг линия отсутствует"} />
      </Stack>
    );

  return (
    <>
      <Stack
        spacing={0.5}
        sx={{
          py: 1,
        }}
      >
        {!approvedLine && (
          <Alert severity="error">
            Факторинг не может быть создан, так как линия ожидает подтверждения
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                color: "#1a1a1a",
                fontSize: "1rem",
              }}
            >
              Использовано
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                color: "#1a1a1a",
                fontSize: "1.3rem",
              }}
            >
              {factoringLineDetails?.summ_current}
              {factoringLineDetails?.currency}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                color: "#1a1a1a",
                fontSize: "1rem",
              }}
            >
              Свободно
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                color: "#1a1a1a",
                fontSize: "1.3rem",
              }}
            >
              {factoringLineDetails?.summ_free}
              {factoringLineDetails?.currency}
            </Typography>
          </Stack>
        </Box>
        <LinearProgress
          variant="determinate"
          value={usedPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              backgroundColor: renderLineColor(usedPercent),
              borderRadius: 4,
            },
          }}
        />
        <Typography variant="body2" fontWeight={600}>
          {usedPercent}%
        </Typography>
      </Stack>
    </>
  );
};

export default FactoringSettingsInfoStep;
