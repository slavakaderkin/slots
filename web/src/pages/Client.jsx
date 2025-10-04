import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Avatar, Modal, Cell, Section, Divider, Text, Button, Navigation } from '@telegram-apps/telegram-ui';
import { GroupedVirtuoso } from 'react-virtuoso';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useBackButton from '@hooks/useBackButton';
import useApiCall from '@hooks/useApiCall';

import useSlots from '@hooks/useSlots';

import DaysScroll from '@components/ui/DaysScroll';
import TimeSlotsGrid from '@components/ui/TimeSlotsGrid';
import ServiceSmallCard from '@components/ui/ServiceSmallCard';
import Space from '@components/layout/Space';
import Scrollable from '@components/layout/Scrollable';
import MainButton from '@components/ui/MainButton';
import InfoPage from '@pages/Info';

import schema from '@schemas/booking';

import BookingCard from '@components/ui/BookingCard';
import { Download, Send, Star, CheckCircle, Slash } from 'react-feather';

const BOOKINGS_PER_PAGE = 10;

export default () => {
  const { clientId } = useParams();
  const { account } = useAuth();
  const { unactiveProfile } = account;
  const { api } = useMetacom();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, showAlert, openTelegramLink } = WebApp;
  const bookingList = useRef(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allBookings, setAllBookings] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSlot] = useState(null);
  const [selectedService, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  const openModal = useCallback(() => {
    HapticFeedback.selectionChanged();
    setIsModalOpen(true);
  }, []);
  

  useBackButton();

  const { data: profile, loading: profileLoading } = 
    useApiCall('profile.my', { autoFetch: true });

  const { call: getClient, data: client, loading: clientLoading } =
    useApiCall('client.byId', { autoFetch: false });

  const { call: getBookings, data: bookings, loading: bookingsLoading } =
    useApiCall('booking.byClient', { autoFetch: false });

  const { call: getServices, data: services, loading: servicesLoading } =
    useApiCall('service.byProfile', { autoFetch: false });

  const {
    selectedDate,
    setSelectedDate,
    showFullDay,
    setShowFullDay,
    days,
    timeSlots,
    slots,
    slotsLoading,
    loadSlots
  } = useSlots(profile);

  useEffect(() => {
    if (isModalOpen) {
      loadSlots(selectedDate);
    }
  }, [isModalOpen, selectedDate, loadSlots]);

  const defaultValues = {
    clientId,
    profileId: profile?.profileId,
    slotId: '',
    serviceId: '',
  };
  
  const formMethods = useForm({ 
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  });
  
  const { formState: { errors }, handleSubmit, reset, watch, trigger, setValue } = formMethods;


  useEffect(() => {
    const { profileId } = profile || {};
    const { slotId } = selectedSlot || {};
    const { serviceId } = selectedService || {};
    reset({
      ...defaultValues,
      profileId,
      slotId,
      serviceId,
    });
    trigger();
  }, [profile, selectedService, selectedSlot]);

  useEffect(() => void trigger(), [trigger]);

  console.log(watch());

  const handleDateSelect = useCallback((date) => {
    HapticFeedback.impactOccurred('light');
    setSelectedDate(date);
  }, [HapticFeedback]);

  const handleSlotClick = useCallback(async (time, slot) => {
    HapticFeedback.impactOccurred('soft');
    if (slot) setSlot(slot);
  }, [selectedDate]);

  const handleServiceSelect = (service) => {
    HapticFeedback.impactOccurred('light');
    setService(service);
    //if (service.serviceId !== selectedService?.serviceId) setSlot(null);

  };

  const handleToggleFullDay = useCallback(() => {
    setShowFullDay(prev => !prev);
  }, [setShowFullDay]);

  const handleBooking = useCallback(async (booking) => {
    HapticFeedback.impactOccurred('light');
    setLoading(true);
    const created = await api.booking.create(booking);
    if (created) {
      showAlert(t('popup.alert.booking.success', { context: selectedService?.autoConfirm ? 'auto' : 'pending' }));
      navigate(`/bookings/${created?.bookingId}`);
    } else {
      showAlert(t('popup.alert.booking.failed'));
    }
    setLoading(false);
  }, [selectedService]);

  const groupedData = useMemo(() => {
    const groups = {};
    allBookings?.forEach(item => {
      const date = item.slot.datetime.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items,
      count: items.length
    }));
  }, [allBookings]);

  const findIndex = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalBefore = 0;
    let closestFutureIdx = -1;
    let minDiff = Number.MAX_VALUE;

    for (let i = 0; i < groupedData.length; i++) {
      const groupDate = new Date(groupedData[i].date);
      groupDate.setHours(0, 0, 0, 0);
    
      if (groupDate.getTime() === today.getTime()) {
        return totalBefore;
      } else if (groupDate > today) {
        const diff = Math.abs(groupDate - today);
        if (diff < minDiff) {
          minDiff = diff;
          closestFutureIdx = totalBefore;
        }
      }
      totalBefore += groupedData[i].count;
    }
    
    return closestFutureIdx !== -1 ? closestFutureIdx : 0;
  }, [groupedData]);

  const scrollToToday = useCallback(() => {
    if (bookingList?.current) {
      bookingList.current.scrollToIndex(findIndex());
    }
  }, [findIndex]);

  const loadInitialBookings = useCallback(async () => {
    setOffset(0);
    setHasMore(true);
    setAllBookings([]);
    
    const result = await getBookings({
      clientId,
      profileId: profile.profileId,
      limit: BOOKINGS_PER_PAGE,
      offset: 0
    });
    
    if (result) {
      setAllBookings(result);
      setHasMore(result.length === BOOKINGS_PER_PAGE);
      setOffset(BOOKINGS_PER_PAGE);
    }
  }, [getBookings, clientId, profile]);

  useEffect(() => {
    if (profile) {
      const { profileId } = profile;
      getClient({ profileId, clientId });
      getServices({ profileId })
      loadInitialBookings().then(scrollToToday);
    }
    
  }, [profile, clientId]);

  const loadMoreBookings = useCallback(async () => {
    if (bookingsLoading || !hasMore) return;

    try {
      const result = await getBookings({ 
        clientId,
        profileId: profile.profileId,
        limit: BOOKINGS_PER_PAGE,
        offset: offset
      });

      if (result && result.length > 0) {
        setAllBookings(prev => [...prev, ...result]);
        setHasMore(result.length === BOOKINGS_PER_PAGE);
        setOffset(prev => prev + result.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more bookings:', error);
    }
  }, [profile, offset, hasMore, bookingsLoading, getBookings]);

  const groupContent = useCallback((index) => {
    const groupDate = new Date(groupedData[index].date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    groupDate.setHours(0, 0, 0, 0);
  
    let color;
    if (groupDate < today) color = theme.hint_color;
    else if (groupDate > today) color = theme.text_color;
    else color = theme.link_color;
    
    return (
      <div style={{ 
        padding: '12px 0 8px 0', 
        background: theme.bg_color, 
        zIndex: 99999, 
        borderBottom: `1px solid ${color}` 
      }}>
        <Text level='3' style={{ color }}>
          {t('common.date', { 
            date: new Date(groupedData[index].date), 
            formatParams: {
              date: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            },
          }).toUpperCase()}
        </Text>
      </div>
    );
  }, [groupedData]);

  const getBookingByGlobalIndex = useCallback((globalIndex) => {
    let currentIndex = 0;
    
    for (const group of groupedData) {
      if (globalIndex < currentIndex + group.count) {
        const localIndex = globalIndex - currentIndex;
        return group.items[localIndex];
      }
      currentIndex += group.count;
    }
    
    return null;
  }, [groupedData]);

  const itemContent = useCallback((index) => {
    const booking = getBookingByGlobalIndex(index);
    if (!booking) return null;
    
    return (
      <div style={{ paddingTop: '12px', zIndex: 1 }}>
        <BookingCard key={`booking_${index}_${booking.bookingId}`} booking={booking} isOwner={true}/>
      </div>
    );
  }, [getBookingByGlobalIndex]);

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const photo = client?.info?.photo_url;
  const name = `${client?.info?.first_name} ${client?.info?.last_name}`;

  const username = client?.info?.username;
  const telegramLink = username ? `https://t.me/${username}` : null;
  const toTelegram = telegramLink ? () => openTelegramLink(telegramLink) : null;

  if (profileLoading || clientLoading) return <InfoPage type='loading'/>;
  if (!profile) return <InfoPage type='empty' />;
  

  return (
    <>
      {isIos && <Space />}

      <Section style={{ width: '100%' }}>
        <Cell
          style={{ background: theme.secondary_bg_color, padding: '8px 12px' }}
          multiline
          subtitle={username && `@${username}`}
          after={toTelegram && <Navigation></Navigation>}
          before={<Avatar size={54} src={photo}/>}
          onClick={toTelegram}
        >
          {name}
        </Cell>

        {}
      </Section>

      {allBookings.length > 0 && <GroupedVirtuoso
        ref={bookingList}
        components={{ Footer: () => <Space gap='150px' /> }}
        increaseViewportBy={{ top: 3, bottom: 3 }}
        groupCounts={groupedData.map(g => g.count)}
        style={{ width: "100%", height: '100%' }}
        groupContent={groupContent}
        itemContent={itemContent}
        endReached={loadMoreBookings}
        overscan={400}
      />}

      {!unactiveProfile &&
        <MainButton 
          handler={openModal} 
          text={t('button.booking', { context: 'client' })}
        />
      }

      <Modal
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
        header={<Modal.Header>{t('client.booking')}</Modal.Header>}
        style={{
          maxHeight: '80vh',
          background: theme.secondary_bg_color,
          padding: '12px 12px 40px 12px'
        }}
      >
        <div style={{ width: '100%', padding: '12px 0' }}>
          <Scrollable>
            {services?.map((service) => (
              <ServiceSmallCard 
                key={service.serviceId}
                service={service}
                selected={selectedService?.serviceId === service.serviceId}
                selectedSlot={selectedSlot}
                onHandleSelect={() => handleServiceSelect(service)}
              />
            ))}
          </Scrollable>
        </div>

        <div style={{ width: '100%', padding: '12px 0' }}>
          <DaysScroll
            days={days}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
        
        <TimeSlotsGrid
          forBooking={true}
          timeSlots={timeSlots}
          slots={slots}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          selectedService={selectedService}
          showFullDay={showFullDay}
          onSlotClick={handleSlotClick}
          onToggleFullDay={handleToggleFullDay}
        />

        {
          <>
            <br />
            <Divider />
            <br />
            <Button
              loading={loading}
              stretched={true}
              mode='filled'
              size='l'
              disabled={Object.keys(errors).length > 0}
              onClick={handleSubmit(handleBooking)}
            >
              {t('button.booking', { context: 'client' })}
            </Button>
          </>
       }
      </Modal>
    </>
  )
};
