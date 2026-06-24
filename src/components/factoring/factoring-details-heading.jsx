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
        <EditNoteRoundedIcon
          //   onClick={handleOpenForm}
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
            fontSize: "3rem",
            color: "primary.main",
            cursor: "pointer",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          padding: "10px",
          justifyContent: { xs: "space-between", sm: "end" },
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

        <Stack
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          {/* {!isCustomerTender && (
            <Tooltip title="Редактировать">
              <EditNoteRoundedIcon
                onClick={handleOpenForm}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  fontSize: "2rem",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          )} */}
        </Stack>
      </Box>
    </Box>
  );
};

export default FactoringDetailsHeading;
