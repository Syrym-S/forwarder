import { Chip } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { isDraftLead } from "../lib/lead-draft";
import RenderStatus from "./render-status";
import { useTranslation } from "react-i18next";
import { useLeadDisplayStatus } from "../hooks/leads/use-lead-display-status.js";

export default function LeadStatus({ lead }) {
  const { t } = useTranslation();
  const status = useLeadDisplayStatus(lead);
  return isDraftLead(lead) ? (
    <Chip
      icon={<EditNoteRoundedIcon />}
      label={t("active_leads.draft")}
      color="warning"
      size="small"
    />
  ) : (
    <RenderStatus status={status} />
  );
}
