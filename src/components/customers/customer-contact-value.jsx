import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Link, Typography } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";

const CustomerContactValue = ({ value, type }) => {
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState("idle");
  const text = String(value).trim();
  const href =
    type === "phone" ? `tel:${text.replace(/[^\d+]/g, "")}` : `mailto:${text}`;
  const feedback =
    copyState === "copied"
      ? t("ui.copied")
      : copyState === "error"
        ? t("ui.copy_failed")
        : "";

  useEffect(() => {
    if (copyState !== "copied" && copyState !== "error") return;
    const timer = setTimeout(() => setCopyState("idle"), 2500);
    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <Box
      component="span"
      sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
    >
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0.5,
          minWidth: 0,
        }}
      >
        <Link
          component="a"
          href={href}
          underline="hover"
          sx={{ minWidth: 0, overflowWrap: "anywhere" }}
        >
          {text}
        </Link>
        <TooltipIconButton
          title={feedback || t("ui.copy")}
          aria-label={`${type === "phone" ? t("ui.copy_number") : `${t("ui.copy")} Email`}: ${text}`}
          size="small"
          disabled={copyState === "copying"}
          onClick={handleCopy}
          sx={{ flexShrink: 0, p: 0.5, mt: -0.5 }}
        >
          {copyState === "copied" ? (
            <CheckRoundedIcon fontSize="inherit" color="success" />
          ) : (
            <ContentCopyRoundedIcon fontSize="inherit" />
          )}
        </TooltipIconButton>
      </Box>
      <Typography
        component="span"
        variant="caption"
        role="status"
        color={copyState === "error" ? "error.main" : "success.main"}
      >
        {feedback}
      </Typography>
    </Box>
  );
};

export default CustomerContactValue;
