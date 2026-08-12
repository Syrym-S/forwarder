import React, { useEffect } from "react";
import RootLayout from "../../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import Section from "../../../shared/ui/section";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import InfoBadge from "../../../shared/ui/info-badge";
import dayjs from "dayjs";
import { renderLineColor } from "../../../shared/helpers/factoring/render-progress-line-color";
import RenderStatus from "../../../shared/ui/render-status";
import FactoringPurchaseCard from "../../../components/factor-line/factoring-purchase-card";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";

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

  const purchases = factoringLineDetails?.purchases;

  const isPurchasesEmpty = purchases?.length === 0;

  useEffect(() => {
    getFactoringLineDetails(id);
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <RootLayout withoutDataCheck>
      <Box
        spacing={0.5}
        sx={{
          display: "flex",
          alignItems: {
            xs: "start",
            sm: "center",
          },
          gap: "10px",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Stack>
            <Typography variant="h5" fontWeight={700}>
              Информация о факторинговой линии
            </Typography>

            <Typography
              sx={{
                color: "color.slate",
              }}
            >
              Подробные данные по заявке
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            py: "10px",
            justifyContent: { xs: "space-between", sm: "end" },
            gap: {
              xs: "3px",
              sm: "10px",
            },
            width: {
              xs: "100%",
              sm: "fit-content",
            },
          }}
          spacing={1}
        >
          <Chip
            label={`Линия #${factoringLineDetails?.id}`}
            color="primary"
            variant="outlined"
          />

          <RenderStatus status={factoringLineDetails?.status} />
        </Box>
      </Box>

      <Section
        icon={<RememberMeOutlinedIcon color="primary" />}
        title={"Данные Фактора"}
      >
        <FactorDataTable factor={factoringLineDetails?.factor} />
      </Section>

      <Section
        icon={<ShowChartOutlinedIcon color="primary" />}
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
      </Section>

      <Section
        icon={<HandshakeIcon color="primary" />}
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

      <Section
        title="Покупки"
        icon={<ShoppingCartOutlinedIcon color="primary" />}
      >
        {isPurchasesEmpty && (
          <Alert
            severity="info"
            sx={{
              width: "100%",
              my: 1,
            }}
          >
            Список покупок пуст
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {purchases?.map((purchase) => (
            <FactoringPurchaseCard data={purchase} />
          ))}
        </Box>
      </Section>
    </RootLayout>
  );
};

export default FactorItem;
