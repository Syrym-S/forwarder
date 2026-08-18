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
  console.log(data);

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Покупка
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                }}
              >
                #{data.id}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "#454545",
                }}
              >
                Сумма сделки
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "#454545",
                }}
              >
                {data.deb_summ}
                {data.deb_currency}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "#454545",
                }}
              >
                Профинансированно
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "#454545",
                }}
              >
                {data.cred_summ}
                {data.cred_currency}
              </Typography>
            </Box>
          </Stack>

          <RenderStatus status={data.status} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FactoringPurchaseCard;
