import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { InfoBadge } from "../lead-form/info-badge";
import InfoField from "../../shared/ui/info-field";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { useNavigate } from "react-router-dom";

function KanbanCard({ item }) {
  const navigate = useNavigate();

  const navigateToLeadItem = () => {
    navigate(`/leads/${item.id}`);
  };

  return (
    <Box
      onClick={navigateToLeadItem}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        transition: ".2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          ЛИД #{item.id}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InfoBadge label="Откуда" value={item.from_location?.address} />

            <ArrowDownwardRoundedIcon
              color="primary"
              sx={{
                fontSize: 28,
              }}
            />

            <InfoBadge label="Куда" value={item.to_location?.address} />
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={item.cargo?.name}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "4px",
            }}
          />

          <Chip
            label={`${item.cargo?.weight_kg} кг`}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "4px",
            }}
          />

          <Chip
            label={`${Number(item.summ).toLocaleString()} ${item.currency}`}
            size="small"
            color="primary"
            sx={{
              borderRadius: "4px",
            }}
          />
        </Stack>
      </CardContent>
    </Box>
  );
}

export default KanbanCard;
