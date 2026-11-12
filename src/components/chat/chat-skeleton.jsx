import { Box, Paper, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import MessageItemSkeleton from "../../shared/ui/loaders/message-item-skeleton";

const ChatSkeleton = ({ isFactoringChat }) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      role="status"
      aria-label={t("ui.loading_chats")}
      aria-busy="true"
      sx={{
        display: "flex",
        flexDirection: "column",
        my: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: { xs: "70dvh", md: 640 },
        minHeight: 400,
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 2,
          px: { xs: 2, md: 2.5 },
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={40}
          height={40}
          sx={{ flexShrink: 0 }}
        />
        <Box sx={{ width: 180, maxWidth: "70%" }}>
          <Skeleton animation="wave" width="100%" height={28} />
          {!isFactoringChat && <Skeleton animation="wave" width="45%" height={20} />}
        </Box>
      </Box>

      <Stack
        aria-hidden="true"
        spacing={2}
        sx={{ flex: 1, minHeight: 0, overflow: "hidden", p: { xs: 1.5, md: 3 } }}
      >
        {[false, true, false].map((isOutgoing, index) => (
          <MessageItemSkeleton key={index} isOutgoing={isOutgoing} />
        ))}
      </Stack>

      <Box
        aria-hidden="true"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          p: { xs: 1.25, sm: 2 },
          flexShrink: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Skeleton
          animation="wave"
          variant="rounded"
          height={44}
          sx={{ flex: 1, minWidth: 0, borderRadius: 2.5 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.5}>
          {[0, 1].map((index) => (
            <Skeleton key={index} animation="wave" variant="rounded" width={44} height={44} />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ChatSkeleton;
