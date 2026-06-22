import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import RenderStatus from "../../../shared/ui/render-status";
import { STATUS } from "../../../shared/const/tenders";

const LeadHeading = ({ leadData, openEditForm }) => {
  const canBeEdited =
    leadData.status !== STATUS.finished &&
    leadData.status !== STATUS.cancelled &&
    leadData.status !== STATUS.deleted;

  return (
    <Box
      spacing={0.5}
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
            Информация о лиде
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
            }}
          >
            Подробные данные по заявке
          </Typography>
        </Stack>
        {canBeEdited && (
          <EditNoteRoundedIcon
            onClick={openEditForm}
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
              fontSize: "2.5rem",
              color: "primary.main",
              cursor: "pointer",
            }}
          />
        )}
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
          label={`Лид #${leadData.id}`}
          color="primary"
          variant="outlined"
        />

        <RenderStatus status={leadData.status} />
        <Stack
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Tooltip title="Редактировать">
            {canBeEdited && (
              <EditNoteRoundedIcon
                onClick={openEditForm}
                sx={{
                  fontSize: "2.5rem",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              />
            )}
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};

export default LeadHeading;
