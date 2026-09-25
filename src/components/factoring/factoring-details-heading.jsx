import { Box, Chip, Stack, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";

const FactoringDetailsHeading = ({ factoring }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: {
          xs: "start",
          sm: "center",
        },
        gap: 2,
        borderRadius: 3,
        justifyContent: "space-between",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <Stack>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 22,
              color: "font_color.heading",
            }}
          >
            Информация о факторинге
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Подробные данные
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexShrink: 0,
          justifyContent: { xs: "start", sm: "end" },
          gap: "10px",
          width: {
            xs: "100%",
            sm: "fit-content",
          },
        }}
      >
        <Chip
          label={`Факторинг #${factoring?.id}`}
          color="primary"
          variant="outlined"
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <RenderStatus status={factoring?.status} />
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringDetailsHeading;
