import { Chip } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { isDraftLead } from "../lib/lead-draft";
import RenderStatus from "./render-status";
import { useTranslation } from "react-i18next";

export default function LeadStatus({ lead }) {
  const { t } = useTranslation();
  return isDraftLead(lead) ? (
    <Chip
      icon={<EditNoteRoundedIcon />}
      label={t("active_leads.draft")}
      color="warning"
      size="small"
    />
  ) : (
    <RenderStatus status={lead?.status} />
  );
}
