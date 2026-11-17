import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Chip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useAdvertisementsStore } from "../../app/store/advertisements/advertisements-store";
import PrimaryButton from "../../shared/ui/button/primary-button";
import ConfirmModal from "../../shared/ui/confirm-modal";

const AdvertisementActions = ({ advertisement }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [action, setAction] = useState(null);
  const isClosing = useAdvertisementsStore((state) => state.isClosing);
  const isDeleting = useAdvertisementsStore((state) => state.isDeleting);
  const error = useAdvertisementsStore((state) =>
    state.actionErrorKey === `my:${advertisement.id}`
      ? state.actionError
      : null,
  );
  const closeAdvertisement = useAdvertisementsStore(
    (state) => state.closeAdvertisement,
  );
  const deleteAdvertisement = useAdvertisementsStore(
    (state) => state.deleteAdvertisement,
  );
  const clearActionError = useAdvertisementsStore(
    (state) => state.clearActionError,
  );
  const isLoading = isClosing || isDeleting;
  const isClosed =
    Boolean(advertisement.closed_at) || advertisement.status === "closed";

  const openConfirmation = (nextAction) => {
    clearActionError();
    setAction(nextAction);
  };

  const handleCancel = () => {
    if (isLoading) return;
    clearActionError();
    setAction(null);
  };

  const handleConfirm = async () => {
    if (!action || isLoading) return;
    try {
      const succeeded =
        action === "delete"
          ? await deleteAdvertisement(advertisement.id)
          : await closeAdvertisement(advertisement.id);
      if (!succeeded) return;
      setAction(null);
      if (action === "delete") navigate("/advertisements", { replace: true });
    } catch {
      // Ошибка запроса отображается из Zustand-стора в окне подтверждения.
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        {!isClosed && (
          <PrimaryButton
            text={t("advertisements.close")}
            variant="outlined"
            startIcon={<BlockRoundedIcon />}
            disabled={isLoading}
            onClick={() => openConfirmation("close")}
          />
        )}

        <PrimaryButton
          text={t("advertisements.delete")}
          variant="outlined"
          error
          startIcon={<DeleteOutlineRoundedIcon />}
          disabled={isLoading}
          onClick={() => openConfirmation("delete")}
        />
      </Box>

      <ConfirmModal
        open={Boolean(action)}
        title={t(
          action === "delete"
            ? "advertisements.delete"
            : "advertisements.close",
        )}
        description={
          <>
            {t(
              action === "delete"
                ? "advertisements.delete_confirmation"
                : "advertisements.close_confirmation",
            )}
            {error && (
              <Box
                component="span"
                role="alert"
                sx={{ display: "block", color: "error.main", mt: 1 }}
              >
                {typeof error === "string"
                  ? error
                  : t("ui.action_failed_retry")}
              </Box>
            )}
          </>
        }
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default AdvertisementActions;
