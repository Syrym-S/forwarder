import { Box, Button, Stack, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { STATUS } from "../../shared/const/tenders";

const TenderDetailsHeading = ({
  tender,
  handleOpenForm,
  isCustomerTender = false,
}) => {
  const tenderStatus = tender?.status;

  const canEditStatus =
    tenderStatus !== STATUS.closed && tenderStatus !== STATUS.cancelled;

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 600, color: "font_color.heading" }}>Детали аукциона</Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", overflowWrap: "anywhere" }}>Аукцион #{tender?.id}</Typography>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ px: 1.5, py: 1, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}><RenderStatus status={tender?.status} /></Box>
        {!isCustomerTender && canEditStatus && <Button variant="outlined" startIcon={<EditNoteRoundedIcon />} onClick={handleOpenForm} sx={{ textTransform: "none", borderRadius: 2, height: 40 }}>Редактировать</Button>}
      </Box>
    </Box>
  );
};
export default TenderDetailsHeading;
