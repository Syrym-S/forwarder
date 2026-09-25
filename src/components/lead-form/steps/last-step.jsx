import { Box } from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import RoutePoint from "../../leads/lead-item/route-point";

export function LastStep({ form }) {
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
          label="Пропуск видеофиксации разгрузки/погрузки"
          value={form.passVerify === true ? "Включён" : "Выключен"}
        />
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
              <StepSection title={`Груз ${index + 1}`}>
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

                  <InfoBadge
                    label="Размеры"
                    value={
                      hasMeasures
                        ? `Ширина: ${cargo.width_cm || "не указана"} см × Длина: ${cargo.length_cm || "не указана"} см × Высота: ${cargo.height_cm || "не указана"} см`
                        : "Данные о размере не указаны"
                    }
                  />
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
