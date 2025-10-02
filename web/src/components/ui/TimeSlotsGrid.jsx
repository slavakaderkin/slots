// components/slots/TimeSlotsGrid.jsx
import { Chip, Avatar, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Clock } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import useTelegram from '@hooks/useTelegram';
import { getLocalTimeFromUTC } from '@helpers/time';

const TimeSlotsGrid = ({
  timeSlots,
  slots,
  forBooking,
  selectedDate,
  showFullDay,
  onSlotClick,
  onToggleFullDay,
  selectedSlot,
  selectedService
}) => {
  const { t } = useTranslation();
  const { themeParams: theme } = useTelegram().WebApp;

  // Мемоизированные константы
  const dateString = useMemo(() => 
    selectedDate.toISOString().split('T')[0], 
    [selectedDate]
  );

  const slotColors = useMemo(() => ({
    booked: theme.button_color, //'#eb8218', //'#01bc7d',
    available: theme.button_color,
    blocked: theme.button_color, //'#eb8218'
  }), [theme.button_color]);

  // Функция для проверки пересечения временных интервалов
  const hasTimeConflict = useMemo(() => {
    const busySlots = slots
      .filter(slot => slot?.booking || slot?.isBlocked)
      .map(slot => {
        const slotTime = getLocalTimeFromUTC(slot.datetime);
        const slotDateTime = new Date(`${dateString}T${slotTime}:00`);
        return {
          start: slotDateTime,
          end: new Date(slotDateTime.getTime() + (slot.duration || 60) * 60000) // дефолт 60 минут
        };
      });

    return (startTime, duration) => {
      const startDateTime = new Date(`${dateString}T${startTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      return busySlots.some(busySlot => startDateTime < busySlot.end && endDateTime > busySlot.start);
    };
  }, [slots, dateString]);

  const isSlotInPast = (time) => {
    const slotDateTime = new Date(`${dateString}T${time}:00`);
    return slotDateTime < new Date();
  };

  const findSlotByTime = (time) => {
    return slots.find(slot => {
      const slotUTCTime = getLocalTimeFromUTC(slot.datetime);
      return slotUTCTime === time;
    });
  };

  const getSlotStatus = (time, slot) => {
    if (isSlotInPast(time)) return 'blocked';
    
    const isSelected = forBooking && selectedSlot?.datetime === slot?.datetime;
    let status = 'empty';
    if (isSelected || (slot && !forBooking)) status = 'available';
    if (slot?.isBlocked) status = 'blocked';
    if (slot?.booking || (!forBooking && slot?.isBlocked)) status = 'booked';

    return status;
  };

  const getSlotData = (time) => {
    const slot = findSlotByTime(time);
    const status = getSlotStatus(time, slot);
    const isPast = isSlotInPast(time);
    
    // Проверяем конфликт по времени для бронирования
    const hasConflict = 
      forBooking && 
      selectedService?.duration && 
      status !== 'booked' && 
      status !== 'blocked' &&
      hasTimeConflict(time, selectedService.duration);

    const isDisabled = 
      (status === 'blocked' || 
      (forBooking && !slot) || 
      (isPast && status !== 'booked') ||
      hasConflict)
      && !slot?.booking;
    
    return {
      slot,
      status: hasConflict ? 'blocked' : status,
      isPast,
      isDisabled,
      hasConflict,
      clientAvatarUrl: slot?.booking?.client?.info?.photo_url,
      backgroundColor: hasConflict ? '#01bc7da6' : (slotColors[status] || 'none')
    };
  };

  const gridStyle = {
    display: 'grid',
    background: theme.secondary_bg_color,
    gridTemplateColumns: 'repeat(auto-fill, minmax(89px, 1fr))',
    gap: '8px',
    padding: '12px'
  };

  const chipStyle = (isDisabled, backgroundColor, hasConflict) => ({
    background: isDisabled ? 'none' : backgroundColor,
    color: isDisabled ? theme.hint_color : theme.text_color,
    opacity: isDisabled ? 0.3 : 1,
    borderRadius: '12px',
    padding: '8px',
    textAlign: 'center',
    minHeight: '32px',
  });

  const renderTimeSlot = (time, index) => {
    const { slot, isDisabled, clientAvatarUrl, backgroundColor, hasConflict } = getSlotData(time);
    
    return (
      <Chip
        mode="outline"
        before={clientAvatarUrl && <Avatar size={24} src={clientAvatarUrl} />}
        key={`${time}-${index}`}
        onClick={() => !isDisabled && onSlotClick(time, slot)}
        disabled={isDisabled}
        style={chipStyle(isDisabled, backgroundColor, hasConflict)}
      >
        <Text style={{ color: theme.text_color }} level="3">
          {time}
        </Text>
      </Chip>
    );
  };

  return (
    <Section
      style={{ width: '100%' }}
      footer={
        <Cell onClick={onToggleFullDay} before={<Clock size={16} />}>
          {showFullDay ? t('button.hide') : t('button.show')}
        </Cell>
      }
    >
      <div style={gridStyle}>
        {timeSlots.map(renderTimeSlot)}
      </div>
    </Section>
  );
};

export default TimeSlotsGrid;