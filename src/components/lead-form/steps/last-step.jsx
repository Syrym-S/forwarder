import { getCargoVolume } from "../../../shared/lib/cargo-volume";
import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import { Box } from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import RoutePoint from "../../leads/lead-item/route-point";
import { useOptionsStore } from "../../../app/store/options";
import { useEffect } from "react";
import InfoItem from "../../../shared/ui/info-item";

export function LastStep({ form }) {
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
      <StepSection title="Проверьте данные">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <RoutePoint
            label="Откуда"
            address={form.from_location.address || "Битые данные"}
            isFrom
            status={
              form.from_location?.is_passed
                ? "Точка пройдена"
                : "Точка не пройдена"
            }
            date={pointSchedules[0]}
          />

          {waypoints.map((waypoint, index) => (
            <RoutePoint
              key={waypoint?.id || `${waypoint?.address}-${index}`}
              isPassed={waypoint?.is_passed}
              label={`Промежуточная точка #${index + 1}`}
              address={waypoint?.address || "Битые данные"}
              status={
                waypoint?.is_passed ? "Точка пройдена" : "Точка не пройдена"
              }
              type={waypoint.type}
              date={pointSchedules[index + 1]}
            />
          ))}

          <RoutePoint
            label="Откуда"
            address={form.to_location.address || "Битые данные"}
            status={
              form.to_location?.is_passed
                ? "Точка пройдена"
                : "Точка не пройдена"
            }
            date={pointSchedules[waypoints.length + 1]}
            isTo
          />
        </Box>
        <InfoBadge
          label="Пропуск подтверждения файлов погрузки/разгрузки"
          value={form.pass_verify === true ? "Включён" : "Выключен"}
        />
      </StepSection>

      <StepSection title="Параметры перевозки">
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
                "Не указан"
              }
            />
          ))}
        </Box>
      </StepSection>

      <StepSection title="Цены">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <InfoBadge label="Цена заказчика" value={form.price} />

          <InfoBadge
            label="Ваша цена за перевозку"
            value={form.transportation_price}
          />
        </Box>
      </StepSection>

      <StepSection title="Данные о грузах">
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
              <StepSection key={cargo.id ?? index} title={`Груз ${index + 1}`}>
                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <InfoBadge label="Тип груза" value={cargo.type} />

                  <InfoBadge
                    label="Вес"
                    value={
                      cargo.weight_kg ? `${cargo.weight_kg} кг` : "Не указан"
                    }
                  />

                  {getCargoVolume(cargo) != null && (
                    <InfoBadge
                      label="Объём"
                      value={`${getCargoVolume(cargo)} м³`}
                    />
                  )}
                  {hasMeasures && (
                    <InfoBadge
                      label="Размеры"
                      value={[
                        cargo.length_cm && `Длина: ${cargo.length_cm} см`,
                        cargo.width_cm && `Ширина: ${cargo.width_cm} см`,
                        cargo.height_cm && `Высота: ${cargo.height_cm} см`,
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

      <StepSection title="Водитель">
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
            label="ФИО водителя"
            value={form.driver?.fio || "Не выбран"}
          />
          <InfoBadge
            label="Номер телефона"
            value={form.driver?.phone || "Не указан"}
          />
        </Box>
      </StepSection>

      <StepSection title="Заказчик">
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
            label="ФИО заказчика"
            value={form.customer?.name || "Не выбран"}
          />
          <InfoBadge label="Тип" value={form.customer?.type || "Не выбран"} />
        </Box>
      </StepSection>

      <StepSection title="Документы">
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
                label={document.name || "Документ"}
                value={document.fileName || "Файл"}
              />
            ))}
          </Box>
        ) : (
          <InfoBadge label="Документы" value="Не добавлены" />
        )}
      </StepSection>
    </Box>
  );
}
