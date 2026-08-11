import React, { useEffect } from "react";
import RootLayout from "../../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import Section from "../../../shared/ui/section";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import InfoBadge from "../../../shared/ui/info-badge";
import dayjs from "dayjs";

const FactorItem = () => {
  const { id } = useParams();

  const factoringLineDetails = useFactorStore(
    (state) => state.factoringLineDetails,
  );
  const getFactoringLineDetails = useFactorStore(
    (state) => state.getFactoringLineDetails,
  );
  const isLoading = useFactorStore((state) => state.isLoading);

  const usedPercent =
    factoringLineDetails?.summ_max > 0
      ? Math.round(
          (factoringLineDetails?.summ_current /
            factoringLineDetails?.summ_max) *
            100,
        )
      : 0;

  // const factorDetails = useFactoringStore((state) => state.factorDetails);
  // const getFactorDetails = useFactoringStore(
  //   (state) => state.getFactoringLineDetails,
  // );

  useEffect(() => {
    getFactoringLineDetails(id);
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <RootLayout withoutDataCheck>
      <Section
        icon={<RememberMeOutlinedIcon color="primary" />}
        title={"Данные Фактора"}
      >
        <FactorDataTable factor={factoringLineDetails?.factor} />
      </Section>

      <Section
        icon={<RememberMeOutlinedIcon color="primary" />}
        title={"Прогресс"}
      >
        <Stack
          spacing={0.5}
          sx={{
            py: 1,
          }}
        >
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
            }}
          />
          <Typography variant="body2" fontWeight={600}>
            {usedPercent}%
          </Typography>
        </Stack>
      </Section>

      <Section
        icon={<RememberMeOutlinedIcon color="primary" />}
        title={"Условия факторинга"}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 3,
          }}
        >
          <InfoBadge
            label="Сумма линии"
            value={`${factoringLineDetails?.summ_max} ${factoringLineDetails?.currency}`}
          />
          <InfoBadge
            label="Период"
            value={`${dayjs(factoringLineDetails?.period_start?.date).format(
              "DD.MM.YYYY",
            )} - ${dayjs(factoringLineDetails?.period_end?.date).format(
              "DD.MM.YYYY",
            )}`}
          />
          <InfoBadge
            label="Срок дней"
            value={factoringLineDetails?.period_days}
          />
          <InfoBadge label="Валюта" value={factoringLineDetails?.currency} />
        </Box>
      </Section>
    </RootLayout>
  );
};

export default FactorItem;
