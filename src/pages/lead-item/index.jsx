import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { useParams } from "react-router-dom";
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { mockLeads } from "../../shared/const/mock-data";
import { useLeadsStore } from "../../app/store/leads-store";
import { MapContainer, TileLayer } from "react-leaflet";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { mapCreateLeadFormToApi } from "../../components/lead-form/model/createLead.adapter";

const Section = ({ icon, title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      mb: 3,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          bgcolor: "background.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography fontWeight={600}>{title}</Typography>
    </Box>

    {children}
  </Paper>
);

const position = [43.222, 76.8512];

const InfoField = ({ label, value, accent = false }) => (
  <Box
    sx={{
      p: 1.5,
      border: "1px solid",
      borderColor: accent ? "primary.main" : "divider",
      borderRadius: 2,
      bgcolor: accent ? "rgba(33,150,243,.04)" : "background.default",
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "color.slate",
      }}
      display="block"
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontWeight: accent ? 600 : 400,
        color: "color.slate_2",
      }}
    >
      {value || "Не указано"}
    </Typography>
  </Box>
);

const LeadItem = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [fromCoords, setFromCoords] = useState(null);
  const { id } = useParams();
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const leadData = useLeadsStore((state) => state.currentLead);

  const defaultValues = useFormDefaultValues(leadData);

  const openEditForm = () => {
    setOpenEdit(true);
  };

  useEffect(() => {
    getLeadItem(id);
  }, [id]);

  if (!leadData) return <>...Загрузка</>;

  // console.log("leadData", leadData);

  return (
    <RootLayout data={leadData}>
      <Box
        spacing={0.5}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            Информация о лиде
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
            }}
          >
            Подробные данные по заявке
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Chip
            label={`Лид #${leadData.id}`}
            color="primary"
            variant="outlined"
          />

          <Chip
            label={leadData.status}
            sx={{
              color: "color.slate_2",
            }}
          />
          <Tooltip title="Редактировать">
            <EditNoteRoundedIcon
              onClick={openEditForm}
              sx={{
                fontSize: "2rem",
                color: "primary.main",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Stack>
      </Box>
      <AddLeadForm
        editingItemId={id}
        openForm={openEdit}
        setOpenForm={setOpenEdit}
        defaultValues={defaultValues}
        isEdit
      />
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        style={{
          zIndex: 0,
          borderRadius: "10px",
          height: "300px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      </MapContainer>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Section
          title="Заказчик"
          icon={<BusinessOutlinedIcon color="primary" />}
        >
          <InfoField label="Название" value={leadData.customer.name} />
        </Section>

        <Section title="Маршрут" icon={<RouteOutlinedIcon color="primary" />}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr auto 1fr",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <InfoField label="Откуда" value={leadData.from_location} />

            <ArrowRightAltRoundedIcon
              sx={{
                fontSize: 40,
                color: "text.secondary",
                justifySelf: "center",
              }}
            />

            <InfoField label="Куда" value={leadData.to_location} />
          </Box>
        </Section>

        <Section
          title="Груз"
          icon={<LocalShippingOutlinedIcon color="primary" />}
        >
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
            <InfoField label="Тип" value={leadData.cargo.type} />

            <InfoField label="Вес" value={`${leadData.cargo.weight_kg} кг`} />

            <InfoField
              label="Цена"
              value={`${leadData.summ} ${leadData.currency}`}
            />

            <InfoField label="Статус" value={leadData.status} />
          </Box>

          <InfoField label="Описание" value={`Груз заявки #${leadData.id}`} />
        </Section>

        <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
          <InfoField label="ФИО" value={leadData.driver_name} />
        </Section>
      </Container>
    </RootLayout>
  );
};

export default LeadItem;
