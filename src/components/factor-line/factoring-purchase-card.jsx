import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import RenderStatus from "../../shared/ui/render-status";

const formatMoney = (value, currency = "KZT") =>
  new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ` ${currency}`;

const formatPercent = (value) => `${value * 100}%`;

const formatDate = (value) =>
  value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "—";

const InfoItem = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography variant="body1" fontWeight={500}>
      {value ?? "—"}
    </Typography>
  </Box>
);

const VerificationItem = ({ label, verified, date }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Chip
      size="small"
      label={verified ? "Подтверждено" : "Не подтверждено"}
      color={verified ? "success" : "default"}
    />

    <Typography variant="body2" color="text.secondary">
      {label}: {formatDate(date)}
    </Typography>
  </Stack>
);

const FactoringPurchaseCard = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Сделка
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ID: {data.id}
              </Typography>
            </Box>

            <RenderStatus status={data.status} />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Финансовая информация
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 1,
              }}
            >
              <InfoItem
                label="Дебиторская сумма"
                value={formatMoney(data.deb_summ, data.deb_currency)}
              />

              <InfoItem
                label="Кредиторская сумма"
                value={formatMoney(data.cred_summ, data.currency)}
              />

              <InfoItem
                label="Комиссия сервиса"
                value={formatPercent(data.proc_service)}
              />

              <InfoItem
                label="Комиссия фактора"
                value={formatPercent(data.proc_factor)}
              />
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 4,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Клиент
              </Typography>

              <Stack spacing={1}>
                <InfoItem label="Имя" value={data.customer?.fullname} />

                <InfoItem label="БИН" value={data.customer?.bin} />

                <InfoItem label="ID" value={data.customer?.id} />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Фактор
              </Typography>

              <Stack spacing={1}>
                <InfoItem label="Компания" value={data.factor?.company_name} />

                <InfoItem label="БИН" value={data.factor?.bin} />

                <InfoItem label="ФИО" value={data.factor?.fio} />

                <InfoItem label="Телефон" value={data.factor?.phone} />
              </Stack>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FactoringPurchaseCard;
