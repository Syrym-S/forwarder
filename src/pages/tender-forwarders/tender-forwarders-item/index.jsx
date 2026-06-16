import { useNavigate, useParams } from "react-router-dom";
import RootLayout from "../../../components/layout/root-layout";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LeadMap from "../../../components/leads/lead-map";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import Loader from "../../../components/layout/loader";
import { useLeadsStore } from "../../../app/store/leads-store";
import { LeadDocumentCard } from "../../../components/leads/documents/LeadDocumentCard";
import TenderForm from "../../../features/tenders/tender-form";
import { useTenderDefaultValues } from "../../../shared/hooks/tender/use-tender-default-values";
import { TENDER_STATUS } from "../../../shared/const/tenders";
import RenderStatus from "../../../shared/ui/render-status";

const TenderForwardersItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);

  const files = useLeadsStore((state) => state.files);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const currentTender = useTendersStore((state) => state.currentTender);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const deleteTender = useTendersStore((state) => state.deleteTender);
  const cancelTender = useTendersStore((state) => state.cancelTender);
  const isLoading = useTendersStore((state) => state.isLoading);

  const defaultValues = useTenderDefaultValues(currentTender);

  const isEmpty = files.length === 0;
  const isCanceled = currentTender?.status === TENDER_STATUS.cancelled;

  const from = {
    lat: currentTender?.lead?.from_location.lat,
    lon: currentTender?.lead?.from_location.lon,
  };
  const to = {
    lat: currentTender?.lead?.to_location.lat,
    lon: currentTender?.lead?.to_location.lon,
  };

  const handleDeleteTender = () => {
    deleteTender(id);
    navigate("/tender-forwarders");
  };

  const handleCancelTender = async () => {
    await cancelTender(id);
    await getTenderDetails(id);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  console.log(currentTender);

  useEffect(() => {
    getTenderDetails(id);
  }, [id]);

  useEffect(() => {
    if (currentTender?.lead?.id) {
      getLeadFiles(currentTender?.lead?.id);
    }
  }, [currentTender?.lead?.id]);

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Box
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
              Информация о тендерной заявке
            </Typography>

            <Typography
              sx={{
                color: "color.slate",
              }}
            >
              Подробные данные по заявке
            </Typography>
          </Stack>
          <EditNoteRoundedIcon
            onClick={handleOpenForm}
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
              fontSize: "3rem",
              color: "primary.main",
              cursor: "pointer",
            }}
          />
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
            label={`Тендер #${currentTender?.id}`}
            color="primary"
            variant="outlined"
          />

          <RenderStatus status={currentTender?.status} />
          <Stack
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Tooltip title="Редактировать">
              <EditNoteRoundedIcon
                onClick={handleOpenForm}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  fontSize: "2rem",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Stack>
        </Box>
      </Box>

      <LeadMap from={from} to={to} id={currentTender?.lead?.id} />

      <TenderForm
        isEdit
        openForm={openForm}
        handleCloseForm={handleCloseForm}
        defaultValues={defaultValues}
      />

      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Section
          title="Данные перевозки"
          icon={<LocalShippingOutlinedIcon color="primary" />}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <InfoField
              label="Откуда"
              value={
                currentTender?.lead?.from_location?.address || "Битые данные"
              }
            />

            <ArrowRightAltRoundedIcon
              sx={{
                fontSize: 40,
                color: "text.secondary",
                justifySelf: "center",
              }}
            />

            <InfoField
              label="Куда"
              value={
                currentTender?.lead?.to_location?.address || "Битые данные"
              }
            />
          </Box>

          <Box sx={{ py: 4 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(4,1fr)",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <InfoField
                label="Тип груза"
                value={currentTender?.lead?.cargo.type}
              />

              <InfoField
                label="Вес груза"
                value={
                  currentTender?.lead?.cargo.weight_kg
                    ? `${currentTender?.lead?.cargo.weight_kg} кг`
                    : "Не указан"
                }
              />

              <InfoField
                label="Цена груза"
                value={`${currentTender?.lead?.cargo_price} ${currentTender?.lead?.currency}`}
              />

              <InfoField label="Статус" value={currentTender?.lead?.status} />
            </Box>

            <InfoField
              label="Описание груза"
              value={`Груз заявки #${currentTender?.lead?.id}`}
            />
          </Box>
        </Section>

        <Section
          title="Информация о тендере"
          icon={<InfoOutlinedIcon color="primary" />}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3,1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <InfoField label="Для кого" value={"-"} />

            <InfoField
              label="Тип публикации"
              value={
                currentTender?.publication_type === "public"
                  ? "Публичный"
                  : "Приватный"
              }
            />

            <InfoField
              label="Макс. участников"
              value={currentTender?.max_participants_count}
            />
            <InfoField
              label="Участников"
              value={currentTender?.participants_count}
            />
          </Box>
        </Section>

        <Section
          title="Документы лида"
          icon={<DescriptionOutlinedIcon color="primary" />}
        >
          {isEmpty && "Cписок пуст"}
          {!isEmpty &&
            files.map((file) => (
              <LeadDocumentCard key={file.path} document={file} />
            ))}
        </Section>
      </Container>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          p: 4,
        }}
      >
        {!isCanceled && (
          <>
            <Button variant="contained" color="success">
              Запустить тендер
            </Button>
            <Button
              onClick={handleCancelTender}
              variant="outlined"
              color="warning"
            >
              Отменить тендер
            </Button>
          </>
        )}
        <Button onClick={handleDeleteTender} variant="outlined" color="error">
          Удалить тендер
        </Button>
      </Box>
    </RootLayout>
  );
};

export default TenderForwardersItem;
