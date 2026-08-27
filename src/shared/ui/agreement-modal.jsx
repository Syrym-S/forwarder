import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { signContractApi } from "../../app/store/agreement/api";
import { useProfileStore } from "../../app/store/profile/profile-store";

const AgreementInfo = ({ openModal, setOpenModal }) => {
  //   const profileData = useProfileStore((state) => state.profileData);
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
    <Dialog open={openModal} disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Наличие договора</DialogTitle>

      <DialogContent>
        <Typography>У вас истек срок договора</Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleContractAnswer}
          disabled={isLoading}
        >
          {isLoading ? "Подписание..." : "Подписать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgreementInfo;
