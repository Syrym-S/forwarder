import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { StepSection } from '../step-section';
import { InfoBadge } from '../info-badge';
import { DRIVERS } from './third-step';
import { CUSTOMERS } from './forth-step';

export function LastStep({ form }) {
   const selectedDriver = DRIVERS.find((driver) => driver.id === form.driverId);
   const selectedCustomer = CUSTOMERS.find(
      (driver) => driver.id === form.customerId,
   );

   return (
      <Box sx={{ display: 'grid', gap: 2 }}>
         <StepSection title='Проверьте данные'>
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: '1fr',
                     sm: '1fr 1fr',
                  },
                  gap: 1,
               }}
            >
               <InfoBadge label='Откуда' value={form.fromLocation} />

               <InfoBadge label='Куда' value={form.toLocation} />

               <InfoBadge label='Дата загрузки' value={form.loadingDate} />

               <InfoBadge label='Тип груза' value={form.cargoType} />

               <InfoBadge label='Вес' value={`${form.weightKg} кг`} />

               <InfoBadge
                  label='Размеры'
                  value={`${form.cargoLengthCm} × ${form.cargoWidthCm} × ${form.cargoHeightCm} см`}
               />

               <InfoBadge
                  label='Цена'
                  value={`${form.price} ${form.currency}`}
                  accent
               />
            </Box>
         </StepSection>

         <StepSection title='Водитель'>
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: '1fr',
                     sm: 'repeat(2, 1fr)',
                  },
                  gap: 1.5,
               }}
            >
               <InfoBadge
                  label='ФИО водителя'
                  value={selectedDriver?.fullName || 'Не выбран'}
               />
               <InfoBadge
                  label='ИИН экспедитора'
                  value={selectedDriver?.iin || '—'}
               />
               <InfoBadge
                  label='Компания'
                  value={selectedDriver?.companyName || '—'}
               />
               <InfoBadge
                  label='БИН компании'
                  value={selectedDriver?.companyBin || '—'}
               />
               <InfoBadge
                  label='Телефон'
                  value={selectedDriver?.phone || '—'}
               />
            </Box>
         </StepSection>

         <StepSection title='Заказщик'>
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: '1fr',
                     sm: 'repeat(2, 1fr)',
                  },
                  gap: 1.5,
               }}
            >
               <InfoBadge
                  label='ФИО заказщика'
                  value={selectedCustomer?.fullName || 'Не выбран'}
               />
               <InfoBadge
                  label='ИИН заказщика'
                  value={selectedCustomer?.iin || '—'}
               />
               <InfoBadge
                  label='Телефон'
                  value={selectedCustomer?.phone || '—'}
               />
            </Box>
         </StepSection>

         <StepSection title='Документы'>
            {form.documents?.length ? (
               <Box
                  sx={{
                     display: 'grid',
                     gap: 1,
                  }}
               >
                  {form.documents.map((document) => (
                     <InfoBadge
                        key={document.id}
                        label={document.name || 'Документ'}
                        value={document.fileName || 'Файл'}
                     />
                  ))}
               </Box>
            ) : (
               <InfoBadge label='Документы' value='Не добавлены' />
            )}
         </StepSection>
      </Box>
   );
}
