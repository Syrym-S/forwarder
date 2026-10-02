import { Chip } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { isDraftLead } from "../lib/lead-draft";
import RenderStatus from "./render-status";

export default function LeadStatus({ lead }) {
  return isDraftLead(lead) ? (
    <Chip
      icon={<EditNoteRoundedIcon />}
      label="Черновик"
      color="warning"
      size="small"
    />
  ) : (
    <RenderStatus status={lead?.status} />
  );
}
