import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Caption, Snackbar } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useSlots from '@hooks/useSlots';
import useApiCall from '@hooks/useApiCall';

import DaysScroll from '@components/ui/DaysScroll';
import TimeSlotsGrid from '@components/ui/TimeSlotsGrid';
import Space from '@components/layout/Space';
import BookingCard from '@components/ui/BookingCard';
import ProfileHeader from '@components/ui/ProfileHeader';
import SubscriptionBanner from '@components/ui/SubscriptionBanner';

import InfoPage from '@pages/Info';

import { createUTCDateFromLocal, getLocalTimeFromUTC, formatDate as formatDatetime } from '@helpers/time';
import { Check } from 'react-feather';


export default () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { api } = useMetacom();
  const { account, token } = useAuth();
  const { unactiveProfile, subscription, trial, profile } = account;
  const subscribtionEndDate = subscription?.end || trial?.end;
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;

  const [selectedBooking, setSlotBooking] = useState(null);
  const [slotAction, setSlotAction] = useState(null);

  const go = useCallback((path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  }, [HapticFeedback, navigate]);

  const {
    selectedDate,
    setSelectedDate,
    showFullDay,
    setShowFullDay,
    days,
    timeSlots,
    slots,
    slotsLoading,
    formatDate,
    loadSlots
  } = useSlots(profile, { withBooking: true });

  useEffect(() => {
    loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  const handleDateSelect = useCallback((date) => {
    HapticFeedback.impactOccurred('light');
    setSlotBooking(null);
    setSelectedDate(date);
  }, [HapticFeedback, setSelectedDate]);

  const handleSlotClick = useCallback(async (time, slot) => {
    HapticFeedback.impactOccurred('soft');
    
    if (slot?.booking) {
      setSlotBooking(slot.booking);
      return;
    } else if (slot?.isBlocked) {
      HapticFeedback.notificationOccurred('error');
      return;
    }

    setSlotBooking(null);
    
    const datetime = createUTCDateFromLocal(time, selectedDate);
    const res = await api.slot.toggle({ 
      datetime,
      profileId: profile.profileId,
      accountId: account.accountId,
      token
    });
    setSlotAction(res);
    loadSlots(selectedDate);
  }, [selectedDate, profile, account, loadSlots]);

  const handleToggleFullDay = useCallback(() => {
    setShowFullDay(prev => !prev);
  }, [setShowFullDay]);


  const renderSnackbar = useCallback(() => {
    if (!slotAction)return;
    const [date] = slotAction.datetime.split('T');
    const [, day] = formatDatetime(new Date(date));
    const time = getLocalTimeFromUTC(slotAction.datetime);
   
    return (
      <Snackbar before={<Check color={theme.button_color} size={20}/>} onClose={() => setSlotAction(null)}>
        {t('workspace.slot', { context: slotAction.action, day, time })}
      </Snackbar>
    )
  }, [slotAction?.datetime])

  if (!profile && (subscription?.isActive || trial?.isActive)) navigate('/settings');
  if (!profile && !(subscription?.isActive || trial?.isActive)) navigate('/promo');

  return (
    <>
      {isIos && <Space />}
      <SubscriptionBanner />
      <ProfileHeader />
      
      {!unactiveProfile &&
        <>
          <div style={{ width: '100%' }}>
            <DaysScroll
              days={days}
              selectedDate={selectedDate}
              formatDate={formatDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        
          <TimeSlotsGrid
            timeSlots={timeSlots}
            slots={slots}
            slotCount={profile?.slotCount}
            selectedDate={selectedDate}
            showFullDay={showFullDay}
            onSlotClick={handleSlotClick}
            onToggleFullDay={handleToggleFullDay}
          />

          {selectedBooking && <BookingCard isOwner={true} booking={{ ...selectedBooking, profile }}/>}
        </>
      }

      <Space gap='120px'/>
      {renderSnackbar()}

    </>
  );
};