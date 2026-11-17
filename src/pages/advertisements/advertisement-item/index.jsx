import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Box, Button } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RootLayout from "../../../components/layout/root-layout";
import LeadDetailsSkeleton from "../../../components/leads/skeleton/lead-details-skeleton";
import LeadMap from "../../../components/leads/lead-map";
import LeadRouteInfo from "../../../components/leads/lead-item/lead-route-info";
import CargoCard from "../../../components/leads/lead-item/lead-cargo-info";
import LeadCargoFilesContainer from "../../../components/leads/lead-cargo-files-container";
import { LeadDocumentsSection } from "../../../components/leads/documents/LeadDocumentsSection";
import Section from "../../../components/leads/lead-item/lead-detail-section";
import AdvertisementInformation from "../../../components/advertisements/advertisement-information";
import AdvertisementActions from "../../../components/advertisements/advertisement-actions";
import { useAdvertisementsStore } from "../../../app/store/advertisements/advertisements-store";
import PageHeading from "../../../shared/ui/page-heading";
import { RenderStatusContent } from "../../../shared/ui/render-status";

const AdvertisementItem = ({ source = "my" }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const currentAdvertisement = useAdvertisementsStore(
    (state) => state.currentAdvertisement,
  );
  const currentAdvertisementKey = useAdvertisementsStore(
    (state) => state.currentAdvertisementKey,
  );
  const isDetailsLoading = useAdvertisementsStore(
    (state) => state.isDetailsLoading,
  );
  const error = useAdvertisementsStore((state) => state.detailsError);
  const getAdvertisementDetails = useAdvertisementsStore(
    (state) => state.getAdvertisementDetails,
  );
  const clearCurrentAdvertisement = useAdvertisementsStore(
    (state) => state.clearCurrentAdvertisement,
  );
  const isLoading =
    isDetailsLoading || currentAdvertisementKey !== `${source}:${id}`;
  const advertisement = !isLoading ? currentAdvertisement : null;
  const lead = advertisement?.lead;
  const cargos = lead?.cargos || [];
  const routeLead = lead
    ? {
        ...lead,
        point_schedules: Array.from(
          { length: (lead.waypoints?.length || 0) + 2 },
          (_, index) =>
            lead.point_schedules?.find(
              (point) => Number(point.point_index) === index,
            ),
        ),
      }
    : null;

  useEffect(() => {
    void getAdvertisementDetails(id, source);
    return clearCurrentAdvertisement;
  }, [id, source, getAdvertisementDetails, clearCurrentAdvertisement]);

  return (
    <RootLayout withoutDataCheck>
      <Box sx={{ maxWidth: 1440, width: "100%", minWidth: 0, mx: "auto" }}>
        {isLoading ? (
          <LeadDetailsSkeleton />
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => getAdvertisementDetails(id, source)}
              >
                {t("ui.retry")}
              </Button>
            }
          >
            {typeof error === "string" ? error : t("dashboard.loading_error")}
            <Button
              component={Link}
              to="/advertisements"
              size="small"
              sx={{ display: "flex", mt: 1 }}
            >
              {t("advertisements.heading")}
            </Button>
          </Alert>
        ) : (
          advertisement && (
            <>
              {lead ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <PageHeading
                      title="Детали объявление"
                      description={`
                    на перевозку #${lead.num}
                    `}
                    />

                    {advertisement.closed_at ? (
                      <RenderStatusContent
                        label={t("dashboard.closed")}
                        variant="outlined"
                        color="#c60606"
                      />
                    ) : (
                      <RenderStatusContent
                        label={t("dashboard.closed")}
                        variant="outlined"
                        color="#51d861"
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      overflow: "hidden",
                      my: 2,
                    }}
                  >
                    <LeadMap
                      key={lead.id}
                      id={lead.id}
                      leadData={lead}
                      fallbackRoutes={lead.routes}
                    />
                  </Box>

                  <LeadRouteInfo leadData={routeLead} showTime />

                  <Section
                    title={t("ui.cargo")}
                    icon={<LocalShippingOutlinedIcon color="primary" />}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 2,
                      }}
                    >
                      {cargos.map((cargo, index) => (
                        <CargoCard
                          key={cargo.id ?? index}
                          cargo={cargo}
                          lead={lead}
                          index={index}
                          cargosCount={cargos.length}
                        />
                      ))}
                    </Box>
                  </Section>

                  {Array.isArray(lead.cargo_actions) && (
                    <LeadCargoFilesContainer
                      cargoActions={lead.cargo_actions}
                      pass_verify={lead.pass_verify === true}
                      readOnly
                    />
                  )}

                  {Array.isArray(lead.documents) && (
                    <Section
                      title={t("ui.documents")}
                      icon={<DescriptionOutlinedIcon color="primary" />}
                    >
                      <LeadDocumentsSection
                        leadStatus={lead.status}
                        documents={[...lead.documents].reverse()}
                        readOnly
                      />
                    </Section>
                  )}
                </>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {t("ui.data_temporarily_unavailable")}
                </Alert>
              )}

              <AdvertisementInformation advertisement={advertisement} />

              {source === "my" && (
                <AdvertisementActions
                  key={advertisement.id}
                  advertisement={advertisement}
                />
              )}
            </>
          )
        )}
      </Box>
    </RootLayout>
  );
};

export default AdvertisementItem;
