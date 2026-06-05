import React, { useEffect } from "react";
import RootLayout from "../../components/layout/root-layout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { useParams } from "react-router-dom";
import { Box, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { mockLeads } from "../../shared/const/mock-data";
import { useLeadsStore } from "../../app/store/leads-store";

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
  const { id } = useParams();
  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  useEffect(() => {
    getLeadItem(id);
  }, [id]);

  if (!currentLead) return <>...Загрузка</>;

  return (
    <RootLayout data={currentLead}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            mb: 4,
          }}
        >
          <Stack spacing={0.5}>
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
              label={`Лид #${currentLead.id}`}
              color="primary"
              variant="outlined"
            />

            <Chip
              label={currentLead.status}
              sx={{
                color: "color.slate_2",
              }}
            />
          </Stack>
        </Box>

        <Section
          title="Заказчик"
          icon={<BusinessOutlinedIcon color="primary" />}
        >
          <InfoField label="Название" value={currentLead.customer} />
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
            <InfoField label="Откуда" value={currentLead.from_location} />

            <ArrowRightAltRoundedIcon
              sx={{
                fontSize: 40,
                color: "text.secondary",
                justifySelf: "center",
              }}
            />

            <InfoField label="Куда" value={currentLead.to_location} />
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
            <InfoField label="Тип" value={currentLead.cargo.type} />

            <InfoField
              label="Вес"
              value={`${currentLead.cargo.weight_kg} кг`}
            />

            <InfoField
              label="Цена"
              value={`${currentLead.summ} ${currentLead.currency}`}
            />

            <InfoField label="Статус" value={currentLead.status} />
          </Box>

          <InfoField
            label="Описание"
            value={`Груз заявки #${currentLead.id}`}
          />
        </Section>

        <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
          <InfoField label="ФИО" value={currentLead.driver_name} />
        </Section>
      </Container>
    </RootLayout>
  );
};

export default LeadItem;
