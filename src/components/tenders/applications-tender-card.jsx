import { Box, Chip, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import RenderStatus from "../../shared/ui/render-status";

const ApplicationsTenderCard = ({ tender }) => {
  const daysLeft = dayjs(tender.end_date_time).diff(dayjs(), "day");
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/tender-applications/${tender.id}`);
  };

  return (
    <Box
      onClick={navigateToDetailPage}
      tabIndex={0}
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        maxWidth: 500,
        borderRadius: 4,
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
      <Stack spacing={2.5}>
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
              Тендер
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
            >
              {/* {lead.customer} */}
            </Typography>
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
              label={`Tender # ${tender.id || "—"}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 999,
                fontWeight: 600,
                backgroundColor: "rgba(33, 150, 243, 0.04)",
              }}
            />

            <RenderStatus status={tender?.status} />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Лид ID
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            {tender.lead.id}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Дата начала
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            {tender.public_date_time}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "grey.50",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Дата окончания
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.8rem",
              display: "block",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            {tender.end_date_time}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "5px",
            flexWrap: "wrap",
          }}
        >
          <Chip
            color="primary"
            variant="outlined"
            label={`Количество участников ${tender.participants_count}`}
            size="small"
            sx={{
              borderRadius: 999,
              fontWeight: 500,
              backgroundColor: "grey.100",
              color: "primary.main",
            }}
          />
          <Chip
            color="primary"
            variant="outlined"
            label={`Максимальное количество участников ${tender.max_participants}`}
            size="small"
            sx={{
              borderRadius: 999,
              fontWeight: 500,
              backgroundColor: "grey.100",
              color: "primary.main",
            }}
          />
        </Box>
        <Chip
          color="success"
          label={`Осталось дней ${daysLeft}`}
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 500,
            // backgroundColor: "rgba(2, 114, 0, 0.1)",
            // color: "#46E843",
          }}
        />
      </Stack>
    </Box>
  );
};

export default ApplicationsTenderCard;
