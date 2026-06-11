import React, { useEffect, useState } from 'react';
import RootLayout from '../../components/layout/root-layout';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { useParams } from 'react-router-dom';
import {
   Box,
   Chip,
   Container,
   Paper,
   Stack,
   Tooltip,
   Typography,
} from '@mui/material';
import { mockLeads } from '../../shared/const/mock-data';
import { useLeadsStore } from '../../app/store/leads-store';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import AddLeadForm from '../../features/leads/add-lead-form';
import { useFormDefaultValues } from '../../shared/hooks/leads/use-form-default-values';
import { mapCreateLeadFormToApi } from '../../components/lead-form/model/createLead.adapter';
import LeadMap from '../../components/leads/lead-map';
import {
   deleteLeadFileApi,
   getLeadFilesApi,
   uploadLeadFileApi,
} from '../../app/store/api';
import { mapLeadFilesResponseFromApi } from '../../features/leads/model/lead-files.adapter';

const Section = ({ icon, title, children }) => (
   <Paper
      elevation={0}
      sx={{
         p: 3,
         border: '1px solid',
         borderColor: 'divider',
         borderRadius: 3,
         mb: 3,
      }}
   >
      <Box
         sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
         }}
      >
         <Box
            sx={{
               width: 32,
               height: 32,
               borderRadius: 1,
               bgcolor: 'background.main',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
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
         border: '1px solid',
         borderColor: accent ? 'primary.main' : 'divider',
         borderRadius: 2,
         bgcolor: accent ? 'rgba(33,150,243,.04)' : 'background.default',
      }}
   >
      <Typography
         variant='caption'
         sx={{
            color: 'color.slate',
         }}
         display='block'
      >
         {label}
      </Typography>

      <Typography
         sx={{
            fontWeight: accent ? 600 : 400,
            color: 'color.slate_2',
         }}
      >
         {value || 'Не указано'}
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

   const start = [leadData?.from_location.lat, leadData?.from_location.lon];
   const end = [leadData?.to_location.lat, leadData?.to_location.lon];

   const route = [start, end];

   const [documents, setDocuments] = useState([]);
   const [isDocumentUploading, setIsDocumentUploading] = useState(false);
   const [documentError, setDocumentError] = useState('');
   const [deletingDocumentIds, setDeletingDocumentIds] = useState([]);

   const openEditForm = () => {
      setOpenEdit(true);
   };

   useEffect(() => {
      getLeadItem(id);
   }, [id]);

   const from = {
      lat: leadData?.from_location.lat,
      lon: leadData?.from_location.lon,
   };
   const to = {
      lat: leadData?.to_location.lat,
      lon: leadData?.to_location.lon,
   };

   async function reloadLeadDocuments(leadId) {
      const response = await getLeadFilesApi(leadId);
      const mappedDocuments = mapLeadFilesResponseFromApi(response);

      setDocuments(mappedDocuments);
   }

   async function handleAddDocument({ name, context, file }) {
      if (!id || !file) return;

      try {
         setIsDocumentUploading(true);
         setDocumentError('');

         await uploadLeadFileApi(id, {
            file,
            name,
            context,
         });

         await reloadLeadDocuments(id);
      } catch (error) {
         setDocumentError(
            error.response?.data?.message ||
               error.message ||
               'Не удалось загрузить документ',
         );
      } finally {
         setIsDocumentUploading(false);
      }
   }

   async function handleDeleteDocument(documentId) {
      const document = documents.find((item) => item.id === documentId);

      if (!document?.path) {
         setDocumentError('Не удалось определить файл для удаления');
         return;
      }

      if (document.source && document.source !== 'forwarder') {
         setDocumentError('Можно удалить только файлы экспедитора');
         return;
      }

      try {
         setDocumentError('');
         setDeletingDocumentIds((prevIds) => [...prevIds, documentId]);

         await deleteLeadFileApi(id, document.path);
         await reloadLeadDocuments(id);
      } catch (error) {
         setDocumentError(
            error.response?.data?.message ||
               error.message ||
               'Не удалось удалить документ',
         );
      } finally {
         setDeletingDocumentIds((prevIds) =>
            prevIds.filter((itemId) => itemId !== documentId),
         );
      }
   }

   useEffect(() => {
      let isCancelled = false;

      async function loadDocuments() {
         if (!id) {
            return;
         }

         try {
            setDocumentError('');

            const response = await getLeadFilesApi(id);
            const mappedDocuments = mapLeadFilesResponseFromApi(response);

            if (!isCancelled) {
               setDocuments(mappedDocuments);
            }
         } catch (error) {
            if (!isCancelled) {
               setDocuments([]);
               setDocumentError(
                  error.response?.data?.message ||
                     error.message ||
                     'Не удалось загрузить документы',
               );
            }
         }
      }

      loadDocuments();

      return () => {
         isCancelled = true;
      };
   }, [id]);

   if (!leadData) return <>...Загрузка</>;

   return (
      <RootLayout data={leadData}>
         <Box
            spacing={0.5}
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
            }}
         >
            <Stack>
               <Typography variant='h5' fontWeight={700}>
                  Информация о лиде
               </Typography>

               <Typography
                  sx={{
                     color: 'color.slate',
                  }}
               >
                  Подробные данные по заявке
               </Typography>
            </Stack>

            <Stack direction='row' spacing={1}>
               <Chip
                  label={`Лид #${leadData.id}`}
                  color='primary'
                  variant='outlined'
               />

               <Chip
                  label={leadData.status}
                  sx={{
                     color: 'color.slate_2',
                  }}
               />
               <Tooltip title='Редактировать'>
                  <EditNoteRoundedIcon
                     onClick={openEditForm}
                     sx={{
                        fontSize: '2rem',
                        color: 'primary.main',
                        cursor: 'pointer',
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

         <LeadMap from={from} to={to} />

         <Container maxWidth='lg' sx={{ py: 4 }}>
            <Section
               title='Заказчик'
               icon={<BusinessOutlinedIcon color='primary' />}
            >
               <InfoField label='Название' value={leadData.customer.name} />
            </Section>

            <Section
               title='Маршрут'
               icon={<RouteOutlinedIcon color='primary' />}
            >
               <Box
                  sx={{
                     display: 'grid',
                     gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr auto 1fr',
                     },
                     gap: 2,
                     alignItems: 'center',
                  }}
               >
                  <InfoField
                     label='Откуда'
                     value={leadData.from_location.city}
                  />

                  <ArrowRightAltRoundedIcon
                     sx={{
                        fontSize: 40,
                        color: 'text.secondary',
                        justifySelf: 'center',
                     }}
                  />

                  <InfoField label='Куда' value={leadData.to_location.city} />
               </Box>
            </Section>

            <Section
               title='Груз'
               icon={<LocalShippingOutlinedIcon color='primary' />}
            >
               <Box
                  sx={{
                     display: 'grid',
                     gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(4,1fr)',
                     },
                     gap: 2,
                     mb: 2,
                  }}
               >
                  <InfoField label='Тип' value={leadData.cargo.type} />

                  <InfoField
                     label='Вес'
                     value={`${leadData.cargo.weight_kg} кг`}
                  />

                  <InfoField
                     label='Цена'
                     value={`${leadData.summ} ${leadData.currency}`}
                  />

                  <InfoField label='Статус' value={leadData.status} />
               </Box>

               <InfoField
                  label='Описание'
                  value={`Груз заявки #${leadData.id}`}
               />
            </Section>

            <Section
               title='Водитель'
               icon={<PersonOutlinedIcon color='primary' />}
            >
               <InfoField label='ФИО' value={leadData.driver_name} />
            </Section>
            <Section
               title='Документы'
               icon={<DescriptionOutlinedIcon color='primary' />}
            >
               <LeadDocumentsSection
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                  isUploading={isDocumentUploading}
                  uploadError={documentError}
                  deletingDocumentIds={deletingDocumentIds}
               />
            </Section>
         </Container>
      </RootLayout>
   );
};

export default LeadItem;
