import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

const FactoringDetailsHeading = ({
  factoring,
  //   handleOpenForm,
  //   isCustomerTender = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: {
          xs: "start",
          sm: "center",
        },
        gap: "10px",
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
          width: "100%",
        }}
      >
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            Информация о факторинге
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
            }}
          >
            Подробные данные
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          padding: "10px",
          justifyContent: { xs: "start", sm: "end" },
          gap: "10px",
          width: {
            xs: "100%",
            sm: "fit-content",
          },
        }}
        spacing={1}
      >
        <Chip
          label={`Факторинг #${factoring?.index}`}
          color="primary"
          variant="outlined"
        />

        <RenderStatus status={factoring?.status} />
      </Box>
    </Box>
  );
};

export default FactoringDetailsHeading;
