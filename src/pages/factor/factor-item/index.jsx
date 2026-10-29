import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import RootLayout from "../../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import Section from "../../../shared/ui/section";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
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
import ConfirmModal from "../../../shared/ui/confirm-modal";
import { STATUS } from "../../../shared/const/tenders";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import PrimaryButton from "../../../shared/ui/button/primary-button";

const FactorItem = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [regenerateFeedback, setRegenerateFeedback] = useState(null);

  const factoringLineDetails = useFactorStore(
    (state) => state.factoringLineDetails,
  );
  const getFactoringLineDetails = useFactorStore(
    (state) => state.getFactoringLineDetails,
  );
  const isLoading = useFactorStore((state) => state.isLoading);
  const isApproveLoading = useFactorStore((state) => state.isApproveLoading);
  const isRegenerateLoading = useFactorStore(
    (state) => state.isRegenerateLoading,
  );
  const regenerateFactoringLine = useFactorStore(
    (state) => state.regenerateFactoringLine,
  );
  const approveFactoreLine = useFactorStore(
    (state) => state.approveFactoreLine,
  );

  const canBeApproved =
    !factoringLineDetails?.forwarder_signed &&
    factoringLineDetails?.status === STATUS.new;

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApproveFactoringLine = async () => {
    const response = await approveFactoreLine(id);
    const link = response.data.sign_url;

    window.open(link, "_blank");
    handleCloseModal();
  };

  const handleRegenerateFactoringLine = async () => {
    setRegenerateFeedback(null);
    try {
      await regenerateFactoringLine(id);
    } catch (error) {
      setRegenerateFeedback({
        severity: "error",
        message:
          error.response?.data?.message ||
          t("ui.document_regeneration_failed_retry"),
      });
      return;
    }

    const refreshed = await getFactoringLineDetails(id);
    setRegenerateFeedback({
      severity: refreshed ? "success" : "warning",
      message: refreshed
        ? t("ui.factoring_line_document_regenerated")
        : t("ui.document_regenerated_refresh_failed"),
    });
  };

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
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                сolor: "font_color.heading",
              }}
            >{t("ui.factoring_line_information")}</Typography>

            <Typography
              sx={{
                color: "color.slate",
              }}
            >{t("ui.request_detailed_information")}</Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            py: "10px",
            justifyContent: { xs: "space-between", sm: "end" },
            alignItems: "center",
            mb: 4,
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
            label={t("ui.line_number", { value1: factoringLineDetails?.id })}
            color="primary"
            variant="outlined"
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <RenderStatus status={factoringLineDetails?.status} />
          </Box>
        </Box>
      </Box>

      <Section
        icon={<RememberMeOutlinedIcon color="primary" />}
        title={t("ui.factor_details")}
      >
        <FactorDataTable factor={factoringLineDetails?.factor} />
      </Section>

      {canBeApproved && (
        <Section
          icon={<RememberMeOutlinedIcon color="primary" />}
          title={t("ui.confirmation")}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <PrimaryButton
              onClick={handleOpenModal}
              variant="outlined"
              disabled={isApproveLoading || isRegenerateLoading || isLoading}
              text={t("ui.confirm")}
            />
            <PrimaryButton
              onClick={handleRegenerateFactoringLine}
              variant="outlined"
              isLoading={isRegenerateLoading}
              disabled={isApproveLoading || isLoading}
              text={
                isRegenerateLoading
                  ? t("ui.regenerating_document")
                  : t("ui.regenerate_document")
              }
            />
          </Box>
        </Section>
      )}

      {regenerateFeedback && (
        <Alert severity={regenerateFeedback.severity} sx={{ mb: 3 }}>
          {regenerateFeedback.message}
        </Alert>
      )}

      {openModal && (
        <ConfirmModal
          open={openModal}
          title={t("ui.factoring_line_confirmation")}
          description={t("ui.confirm_factoring_line_question")}
          onCancel={handleCloseModal}
          onConfirm={handleApproveFactoringLine}
          isLoading={isApproveLoading}
        />
      )}

      <Section
        icon={<ShowChartOutlinedIcon color="primary" />}
        title={t("ui.progress")}
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
              >{t("ui.used")}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1.3rem",
                }}
              >
                {moneySpacingFormat(factoringLineDetails?.summ_current || 0)}
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
              >{t("ui.available")}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  color: "#1a1a1a",
                  fontSize: "1.3rem",
                }}
              >
                {moneySpacingFormat(factoringLineDetails?.summ_free || 0)}
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
        title={t("ui.factoring_terms")}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          <InfoBadge
            label={t("ui.line_amount")}
            value={`${moneySpacingFormat(factoringLineDetails?.summ_max || 0)} ${factoringLineDetails?.currency}`}
          />
          <InfoBadge
            label={t("ui.period_2")}
            value={`${dayjs(factoringLineDetails?.period_start?.date).format(
              "DD.MM.YYYY",
            )} - ${dayjs(factoringLineDetails?.period_end?.date).format(
              "DD.MM.YYYY",
            )}`}
          />
          <InfoBadge
            label={t("ui.term")}
            value={factoringLineDetails?.period_days}
          />
          <InfoBadge label={t("ui.currency")} value={factoringLineDetails?.currency} />
        </Box>
      </Section>

      <Section
        title={t("ui.purchases")}
        icon={<ShoppingCartOutlinedIcon color="primary" />}
      >
        {isPurchasesEmpty && (
          <Alert
            severity="info"
            sx={{
              width: "100%",
              my: 1,
            }}
          >{t("ui.purchase_list_empty")}</Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
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
