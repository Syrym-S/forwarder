import { useParams } from "react-router-dom";
import RootLayout from "../../../components/layout/root-layout";
import { useEffect } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import {
  Box,
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

const TenderForwardersItem = () => {
  const { id } = useParams();

  const files = useLeadsStore((state) => state.files);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);

  const currentTender = useTendersStore((state) => state.currentTender);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const isLoading = useTendersStore((state) => state.isLoading);

  const leadData = currentTender?.lead;
  const isEmpty = files.length === 0;

  const from = {
    lat: leadData?.from_location.lat,
    lon: leadData?.from_location.lon,
  };
  const to = {
    lat: leadData?.to_location.lat,
    lon: leadData?.to_location.lon,
  };

  useEffect(() => {
    getTenderDetails(id);
  }, [id]);

  useEffect(() => {
    if (leadData?.id) {
      getLeadFiles(leadData.id);
    }
  }, [leadData?.id]);

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Box
        spacing={0.5}
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
            // onClick={openEditForm}
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
            label={`Тендер #${currentTender.id}`}
            color="primary"
            variant="outlined"
          />

          <Chip
            label={currentTender.status}
            sx={{
              color: "color.slate_2",
            }}
          />
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
                // onClick={openEditForm}
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

      <LeadMap from={from} to={to} id={leadData.id} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
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
              value={leadData.from_location?.address || "Битые данные"}
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
              value={leadData.to_location?.address || "Битые данные"}
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
              <InfoField label="Тип груза" value={leadData.cargo.type} />

              <InfoField
                label="Вес груза"
                value={
                  leadData.cargo.weight_kg
                    ? `${leadData.cargo.weight_kg} кг`
                    : "Не указан"
                }
              />

              <InfoField
                label="Цена груза"
                value={`${leadData.cargo_price} ${leadData.currency}`}
              />

              <InfoField label="Статус" value={leadData.status} />
            </Box>

            <InfoField
              label="Описание груза"
              value={`Груз заявки #${leadData.id}`}
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
                currentTender.publication_type === "public"
                  ? "Публичный"
                  : "Приватный"
              }
            />

            <InfoField
              label="Макс. участников"
              value={currentTender.max_participants_count}
            />
            <InfoField
              label="Участников"
              value={currentTender.participants_count}
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
    </RootLayout>
  );
};

export default TenderForwardersItem;
