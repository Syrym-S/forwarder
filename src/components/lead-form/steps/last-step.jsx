import { Box, Chip, Stack, Typography } from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import RenderType from "../../../shared/ui/render-type";

export function LastStep({ form }) {
  const waypoints = form.waypoints;
  const cargos = form.cargos;

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <StepSection title="Проверьте данные">
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
          <InfoBadge label="Откуда" value={form.to_location.address} />

          {waypoints.map((waypoint, index) => (
            <Box
              sx={{
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "-15px",
                  right: 5,
                }}
              >
                <RenderType type={waypoint.type} size="small" />
              </Box>

              <InfoBadge
                label={`Промежуточная точка ${index + 1}`}
                accent={waypoint.is_passed}
                value={
                  <Stack spacing={1}>
                    <Typography>
                      {waypoint.address || "Битые данные"}
                    </Typography>
                  </Stack>
                }
              />
            </Box>
          ))}

          <InfoBadge label="Куда" value={form.from_location.address} />

          <InfoBadge label="Дата загрузки" value={form.loadingDate} />
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

      <StepSection title="Заказщик">
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
            label="ФИО заказщика"
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
