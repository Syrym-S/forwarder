import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";

const FactorLineSettings = () => {
  const factorDetails = useFactoringStore((state) => state.factorDetails);
  const isFactorDetailsLoading = useFactoringStore(
    (state) => state.isFactorDetailsLoading,
  );

  const items = [
    {
      label: "Изменение валюты",
      value: factorDetails?.is_currency_changeable,
    },
    {
      label: "Открытая линия",
      value: factorDetails?.is_open,
    },
    {
      label: "Изменение периода",
      value: factorDetails?.is_period_changeable,
    },
    {
      label: "Изменение суммы",
      value: factorDetails?.is_sum_changeable,
    },
  ];

  if (isFactorDetailsLoading)
    return (
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Card>
    );

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Параметры факторинговой линии
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {items.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="body2">{item.label}</Typography>

              <Chip
                size="small"
                icon={
                  item.value ? (
                    <CheckCircleOutlineOutlinedIcon />
                  ) : (
                    <CancelOutlinedIcon />
                  )
                }
                label={item.value ? "Да" : "Нет"}
                color={item.value ? "success" : "default"}
                variant="outlined"
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FactorLineSettings;
