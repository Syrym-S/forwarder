import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";

export function LastStep({ form }) {
  console.log(form);

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
            gap: 1,
          }}
        >
          <InfoBadge label="Откуда" value={form.to_location.address} />

          <InfoBadge label="Куда" value={form.from_location.address} />

          <InfoBadge label="Дата загрузки" value={form.loadingDate} />

          <InfoBadge label="Тип груза" value={form.type} />

          <InfoBadge
            label="Вес"
            value={form.weight_kg ? `${form.weight_kg} кг` : "Не указан"}
          />

          <InfoBadge
            label="Размеры"
            value={
              form.height_cm
                ? `${form.height_cm} × ${form.width_cm} × ${form.height_cm} см`
                : "Данные о размере не указаны"
            }
          />

          <InfoBadge
            label="Цена"
            value={
              form.summ
                ? `${form.summ} ${form.currency || "KZT"}`
                : "Цена не указана"
            }
            accent
          />
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
            value={form.driver[0]?.fio || "Не выбран"}
          />
          <InfoBadge
            label="Номер телефона"
            value={form.driver[0]?.phone || "Не указан"}
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
