import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PrimaryButton from "./button/primary-button";
import { signContractApi } from "../../app/store/agreement/api";
import { useProfileStore } from "../../app/store/profile/profile-store";

const AgreementInfo = ({ openModal, setOpenModal }) => {
  const getProfileData = useProfileStore((state) => state.getProfileData);

  const [isLoading, setIsLoading] = useState(false);

  const handleContractAnswer = async () => {
    try {
      setIsLoading(true);

      const response = await signContractApi();

      const signUrl = response?.data?.sign_url;

      if (signUrl) {
        window.open(signUrl, "_blank", "noopener,noreferrer");

        setOpenModal(false);
        return;
      }

      console.error("Сервер не вернул sign_url");
    } catch (error) {
      console.error("Ошибка при подписании договора:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Dialog
      open={openModal}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      aria-labelledby="agreement-modal-title"
      aria-describedby="agreement-modal-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 16px 48px rgba(22, 36, 62, 0.16)",
          },
        },
      }}
    >
      <DialogTitle
        id="agreement-modal-title"
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "font_color.heading",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 2.5,
            bgcolor: "background.main",
            color: "primary.main",
          }}
        >
          <DescriptionOutlinedIcon />
        </Box>
        Наличие договора
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Typography
          id="agreement-modal-description"
          sx={{ fontSize: "0.95rem", lineHeight: 1.6, color: "color.slate_2" }}
        >
          Срок действия вашего договора истёк. Подпишите договор, чтобы
          продолжить работу на платформе.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.slate",
        }}
      >
        <PrimaryButton
          fullWidth
          onClick={handleContractAnswer}
          isLoading={isLoading}
          text={isLoading ? "Подписание..." : "Подписать договор"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AgreementInfo;
