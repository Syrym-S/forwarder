import { Box, Chip, Stack, Typography } from "@mui/material";
import RenderStatus, {
  RenderStatusContent,
} from "../../shared/ui/render-status";
import { useNavigate } from "react-router-dom";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import InfoItem from "../../shared/ui/info-item";

const FactoringCard = ({ factoring }) => {
  const navigate = useNavigate();

  const handleNavigateToDetailsPage = () => {
    navigate(`/factoring/${factoring?.id}`);
  };

  return (
    <Box
      onClick={handleNavigateToDetailsPage}
      tabIndex={0}
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 7,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Факторинг
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.3,
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                },
                fontWeight: 500,
              }}
            ></Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
            }}
          >
            <Chip
              label={`Index# ${factoring?.id}`}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontWeight: 600,
                backgroundColor: "rgba(33, 150, 243, 0.04)",
              }}
            />
            <RenderStatus status={factoring?.status} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 1,
          }}
        >
          <InfoItem
            label={"Фактора"}
            value={factoring?.factor?.company_name || "-"}
          />
          <InfoItem label={"ФИО Фактора"} value={factoring?.factor?.fio} />
          <InfoItem label={"БИН Фактора"} value={factoring?.factor?.bin} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: {
              xs: 1,
              sm: 3,
            },
          }}
        >
          <InfoItem
            label={"Задолженность"}
            value={`${moneySpacingFormat(factoring?.deb_summ)} ${factoring?.deb_currency}`}
          />
          <InfoItem
            label={"Оплата за задолженность"}
            value={`${moneySpacingFormat(factoring?.cred_summ)} ${factoring?.currency}`}
          />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          <InfoItem
            label={"Процент фактора"}
            value={`${(factoring?.proc_factor * 100).toFixed(1)}%`}
          />
          <InfoItem
            label={"Процент сервиса"}
            value={`${(factoring?.proc_service * 100).toFixed(1)}%`}
          />
        </Box>
      </Stack>

      <Box sx={{ py: 1, display: "flex", gap: 4 }}>
        <RenderStatusContent
          label={`Вы: ${factoring?.verified_forwarder ? "Подтвержден" : "Не подтверждено"}`}
          color={factoring?.verified_customer ? "#51d861" : "#e9821b"}
        />
        <RenderStatusContent
          label={`Фактор: ${factoring?.verified_factor ? "Подтвержден" : "Не подтверждено"}`}
          color={factoring?.verified_customer ? "#51d861" : "#e9821b"}
        />
        <RenderStatusContent
          label={`Заказчик: ${factoring?.verified_customer ? "Подтвержден" : "Не подтверждено"}`}
          color={factoring?.verified_customer ? "#51d861" : "#e9821b"}
        />
      </Box>
    </Box>
  );
};

export default FactoringCard;
