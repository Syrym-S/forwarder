import { useTranslation } from "react-i18next";
import { getCargoVolume } from "../../../shared/lib/cargo-volume";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import { Box } from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import RoutePoint from "../../leads/lead-item/route-point";
import { useOptionsStore } from "../../../app/store/options";
import { useEffect } from "react";
import InfoItem from "../../../shared/ui/info-item";
import { isInternationalRoute } from "../../../shared/lib/international-route";

export function LastStep({ form }) {
  const { t } = useTranslation();
  const leadParams = useOptionsStore((state) => state.leadParams);
  const getLeadParams = useOptionsStore((state) => state.getLeadParams);

  useEffect(() => {
    getLeadParams();
  }, [getLeadParams]);
  const waypoints = form.waypoints;
  const cargos = form.cargos;
  const pointSchedules = form?.point_schedules || [];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <StepSection title={t("lead_form.review_details")}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <RoutePoint
            label={t("ui.origin")}
            address={form.from_location.address || t("ui.invalid_data")}
            isFrom
            status={
              form.from_location?.is_passed
                ? t("ui.point_passed")
                : t("ui.point_not_passed")
            }
            date={pointSchedules[0]}
          />

          {waypoints.map((waypoint, index) => (
            <RoutePoint
              key={waypoint?.id || `${waypoint?.address}-${index}`}
              isPassed={waypoint?.is_passed}
              label={t("ui.waypoint_number", { value1: index + 1 })}
              address={waypoint?.address || t("ui.invalid_data")}
              status={
                waypoint?.is_passed ? t("ui.point_passed") : t("ui.point_not_passed")
              }
              type={waypoint.type}
              date={pointSchedules[index + 1]}
            />
          ))}

          <RoutePoint
            label={t("ui.origin")}
            address={form.to_location.address || t("ui.invalid_data")}
            status={
              form.to_location?.is_passed
                ? t("ui.point_passed")
                : t("ui.point_not_passed")
            }
            date={pointSchedules[waypoints.length + 1]}
            isTo
          />
        </Box>
        <InfoBadge
          label={t("ui.skip_loading_unloading_file_confirmation")}
          value={form.pass_verify === true ? t("ui.enabled") : t("ui.disabled")}
        />
      </StepSection>

      <StepSection title={t("ui.lead_parameters")}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
          }}
        >
          {transportationParameters.map(({ name, label }) => (
            <InfoBadge
              key={name}
              label={label}
              value={
                leadParams[name]?.find(
                  (option) =>
                    String(option.id) === String(form[name]?.id ?? form[name]),
                )?.name ||
                form[name]?.name ||
                form[name] ||
                t("ui.not_specified")
              }
            />
          ))}
        </Box>
      </StepSection>

      <StepSection title={t("lead_form.prices")}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <InfoBadge label={t("ui.customer_price")} value={form.price} />

          <InfoBadge
            label={t("ui.your_lead_price")}
            value={form.transportation_price}
          />
        </Box>
      </StepSection>

      <StepSection title={t("lead_form.cargo_details")}>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "1fr",
          }}
        >
          {cargos.map((cargo, index) => {
            const hasMeasures =
              cargo.height_cm || cargo.width_cm || cargo.length_cm;

            return (
              <StepSection key={cargo.id ?? index} title={t("ui.cargo_number", { value1: index + 1 })}>
                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <InfoBadge label={t("lead_form.cargo_type")} value={cargo.type} />
                  {isInternationalRoute(form) && <InfoBadge label={t("lead_form.commodity_code")} value={cargo.tnved_code || t("ui.not_specified")} />}

                  <InfoBadge
                    label={t("ui.weight")}
                    value={
                      cargo.weight_kg ? t("ui.weight_kilograms", { value1: cargo.weight_kg }) : t("ui.not_specified")
                    }
                  />

                  {getCargoVolume(cargo) != null && (
                    <InfoBadge
                      label={t("ui.volume")}
                      value={t("ui.volume_cubic_meters", { value1: getCargoVolume(cargo) })}
                    />
                  )}
                  {hasMeasures && (
                    <InfoBadge
                      label={t("ui.dimensions")}
                      value={[
                        cargo.length_cm && t("ui.length_centimeters", { value1: cargo.length_cm }),
                        cargo.width_cm && t("ui.width_centimeters", { value1: cargo.width_cm }),
                        cargo.height_cm && t("ui.height_centimeters", { value1: cargo.height_cm }),
                      ]
                        .filter(Boolean)
                        .join(" × ")}
                    />
                  )}
                </Box>
              </StepSection>
            );
          })}
        </Box>
      </StepSection>

      <StepSection title={t("ui.driver")}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <InfoBadge
            label={t("lead_form.driver_full_name")}
            value={form.driver?.fio || t("lead_form.not_selected")}
          />
          <InfoBadge
            label={t("ui.phone")}
            value={form.driver?.phone || t("ui.not_specified")}
          />
        </Box>
      </StepSection>

      <StepSection title={t("ui.customer")}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <InfoBadge
            label={t("lead_form.customer_full_name")}
            value={form.customer?.name || t("lead_form.not_selected")}
          />
          <InfoBadge label={t("ui.type")} value={form.customer?.type || t("lead_form.not_selected")} />
        </Box>
      </StepSection>

      <StepSection title={t("ui.documents")}>
        {form.documents?.length ? (
          <Box
            sx={{
              display: "grid",
              gap: 1,
            }}
          >
            {form.documents.map((document) => (
              <InfoBadge
                key={document.id}
                label={document.name || t("ui.document")}
                value={document.fileName || t("ui.file")}
              />
            ))}
          </Box>
        ) : (
          <InfoBadge label={t("ui.documents")} value={t("lead_form.not_added")} />
        )}
      </StepSection>
    </Box>
  );
}
