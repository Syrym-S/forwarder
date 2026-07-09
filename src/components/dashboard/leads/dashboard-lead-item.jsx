import { Box, Chip, Divider, Stack, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import RenderStatus from '../../../shared/ui/render-status';

function formatLocation(location) {
  return location?.address || 'Адрес не указан';
}

function formatLeadPrice(lead) {
  const price = lead?.summ === 0 ? lead?.cargo_price : lead?.summ;

  if (price === null || price === undefined || price === '') {
    return 'Цена не указана';
  }

  return `${Number(price).toLocaleString('ru-RU')} ${lead?.currency || ''}`;
}

function hasRouteCoordinates(lead) {
  return Boolean(
    lead?.from_location?.lat &&
    lead?.from_location?.lon &&
    lead?.to_location?.lat &&
    lead?.to_location?.lon,
  );
}

const DashboardLeadItem = ({ 
  lead,
  isSelected,
  isHovered,
  onSelectLead,
  onHoverLead,
  onLeaveLead,
}) => {
  const navigate = useNavigate();
  const leadId = lead?.id;
  const hasRoute = hasRouteCoordinates(lead);

  const handleClick = () => {
    onSelectLead?.(leadId);
  };

  const handleMouseEnter = () => {
    onHoverLead?.(leadId);
  };

  const handleMouseLeave = () => {
    onLeaveLead?.();
  };

  const handleDoubleClick = () => {
    navigate(`/leads/${leadId}`);
  };


  return (
    <Paper
      variant='outlined'
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      sx={{
        p: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.2s ease",
        borderColor: isSelected || isHovered ? "primary.main" : "divider",
        backgroundColor: isSelected
          ? "primary.50"
          : isHovered
            ? "rgba(33, 150, 243, 0.04)"
            : "background.paper",
        boxShadow:
          isSelected || isHovered
            ? "0 6px 18px rgba(33, 150, 243, 0.16)"
            : "none",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 6px 18px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={1.25}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Chip
            label={`Лид # ${lead?.id || '—'}`}
            size='small'
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              borderRadius: 999,
            }}
          />

          {lead?.status && <RenderStatus status={lead.status} />}
        </Box>

        <Box>
          <Typography variant='caption' color='text.secondary'>
            Откуда
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {formatLocation(lead?.from_location)}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant='caption' color='text.secondary'>
            Куда
          </Typography>

          <Typography
            fontWeight={500}
            sx={{
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {formatLocation(lead?.to_location)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {formatLeadPrice(lead)}
          </Typography>

          {!hasRoute && (
            <Chip
              label='Нет координат'
              size='small'
              color='warning'
              variant='outlined'
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default DashboardLeadItem;
