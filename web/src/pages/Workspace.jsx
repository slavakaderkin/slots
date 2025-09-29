import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Section, Cell, Avatar, Caption, Text, SegmentedControl, Navigation } from '@telegram-apps/telegram-ui';
import { GroupedVirtuoso } from 'react-virtuoso';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useSlots from '@hooks/useSlots';
import useApiCall from '@hooks/useApiCall';

import DaysScroll from '@components/ui/DaysScroll';
import TimeSlotsGrid from '@components/ui/TimeSlotsGrid';
import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';
import BookingCard from '@components/ui/BookingCard';
import RatingBadge from '@components/ui/RatingBadge';

import InfoPage from '@pages/Info';

import { createUTCDateFromLocal } from '@helpers/time';
import { Calendar, Star, X } from 'react-feather';

// Константы для пагинации
const BOOKINGS_PER_PAGE = 30;

export default () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { api } = useMetacom();
  const { account, token } = useAuth();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;
  const bookingList = useRef(null);

  const [isSlotsOpen, setIsSlotsOpen] = useState(false);
  const [selectedBooking, setSlotBooking] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  const [bookingsKind, setBookingsKind] = useState('future');

  const switchBookinkKind = (kind) => () => {
    HapticFeedback.impactOccurred('soft');
    setBookingsKind(kind)
    loadInitialBookings(kind);
  }

  const { data: profile, loading: profileLoading } = 
    useApiCall('profile.my', { autoFetch: true });

  const { call: getBookings, loading: bookingsLoading, error } = 
    useApiCall('booking.byProfile', { autoFetch: false });

  // Группировка данных
  const groupedData = useMemo(() => {
    const groups = {};
    
    // Сортируем бронирования в зависимости от типа
    const sortedBookings = [...allBookings].sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      
      if (bookingsKind === 'future') return dateA - dateB;
      else return dateB - dateA;
    });
  
    sortedBookings.forEach(item => {
      const date = item.datetime.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
  
    // Сортируем группы по дате в зависимости от типа
    const sortedGroups = Object.entries(groups).sort(([dateA], [dateB]) => {
      if (bookingsKind === 'future') return new Date(dateA) - new Date(dateB);
      else return new Date(dateB) - new Date(dateA);
    });
  
    return sortedGroups.map(([date, items]) => ({
      date,
      items,
      count: items.length
    }));
  }, [allBookings, bookingsKind]);

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

  
  const findIndex = useCallback(() => {
    if (bookingsKind === 'past') return 0;
  
    // Для будущих - ищем сегодня или ближайшую будущую дату
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let totalBefore = 0;
  
    for (let i = 0; i < groupedData.length; i++) {
      const groupDate = new Date(groupedData[i].date);
      groupDate.setHours(0, 0, 0, 0);
    
      if (groupDate.getTime() >= today.getTime()) {
        return totalBefore;
      }
      totalBefore += groupedData[i].count;
    }
    
    return 0;
  }, [groupedData, bookingsKind]); 

  const scrollToToday = useCallback(() => {
    if (bookingList?.current) {
      setTimeout(() => {
        bookingList.current.scrollToIndex(findIndex());
      }, 100);
    }
  }, [findIndex]);

  // Загрузка начальных данных
  useEffect(() => {
    if (profile) {
      loadInitialBookings(bookingsKind);
    }
  }, [profile, bookingsKind]);

  useEffect(() => {
    if (allBookings.length > 0 && !bookingsLoading) {
      scrollToToday();
    }
  }, [allBookings.length, bookingsLoading, scrollToToday]);

  const loadInitialBookings = useCallback(async (kind) => {
    setOffset(0);
    setHasMore(true);
    setAllBookings([]);
    
    const result = await getBookings({ 
      profileId: profile.profileId,
      kind,
      limit: BOOKINGS_PER_PAGE,
      offset: 0
    });
    
    if (result) {
      setAllBookings(result);
      setHasMore(result.length === BOOKINGS_PER_PAGE);
      setOffset(BOOKINGS_PER_PAGE);
    }
  }, [profile, getBookings]);

  const loadMoreBookings = useCallback(async () => {
    if (bookingsLoading || !hasMore) return;

    try {
      const result = await getBookings({ 
        profileId: profile.profileId,
        limit: BOOKINGS_PER_PAGE,
        kind: bookingsKind,
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
  }, [profile, offset, hasMore, bookingsLoading, getBookings, bookingsKind]);

  const groupContent = useCallback((index) => {
    const groupDate = new Date(groupedData[index].date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    groupDate.setHours(0, 0, 0, 0);
  
    let color;
    if (bookingsKind === 'past') {
      // Для прошлых все даты серые
      color = theme.hint_color;
    } else {
      // Для будущих цвет зависит от отношения к сегодняшнему дню
      if (groupDate < today) color = theme.hint_color;
      else if (groupDate > today) color = theme.text_color;
      else color = theme.link_color;
    }
    
    return (
      <div style={{ 
        padding: '12px 0 8px 0', 
        background: theme.bg_color, 
        zIndex: 99999, 
        borderBottom: `1px solid ${color}` 
      }}>
        <Text level='2' style={{ color }}>
          {t('common.date', { 
            date: new Date(groupedData[index].date), 
            formatParams: {
              date: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            },
          }).toUpperCase()}
        </Text>
      </div>
    );
  }, [groupedData, bookingsKind, theme]);


  const itemContent = useCallback((index) => {
    const booking = getBookingByGlobalIndex(index);
    if (!booking) return null;
    
    return (
      <div style={{ paddingTop: '12px', zIndex: 1 }}>
        <BookingCard key={`booking_${index}_${booking.bookingId}`} isOwner={true} booking={booking}/>
      </div>
    );
  }, [getBookingByGlobalIndex]);

  // Footer для загрузки
  const Footer = useCallback(() => {
    if (allBookings.length === 0 && !bookingsLoading) return <InfoPage type='empty' />
    else return <Space gap='150px'/>
  }, [allBookings.length]);

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
    if (isSlotsOpen) {
      loadSlots(selectedDate);
    }
  }, [isSlotsOpen, selectedDate, loadSlots]);

  const openSlots = useCallback(() => {
    HapticFeedback.impactOccurred('soft');
    setIsSlotsOpen(true);
    setSelectedDate(new Date());
  }, [HapticFeedback, setSelectedDate]);

  const closeSlots = useCallback(() => {
    HapticFeedback.impactOccurred('soft');
    setSlotBooking(null);
    setIsSlotsOpen(false);
  }, [HapticFeedback]);

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
    
    try {
      const datetime = createUTCDateFromLocal(time, selectedDate);

      await api.slot.toggle({ 
        datetime,
        profileId: profile.profileId,
        accountId: account.accountId,
        token
      });

      loadSlots(selectedDate);
    } catch (error) {
      console.error('Slot booking failed:', error);
    }
  }, [selectedDate, profile, account, loadSlots]);

  const handleToggleFullDay = useCallback(() => {
    setShowFullDay(prev => !prev);
  }, [setShowFullDay]);

  const renderCalendarHint = () => {
    const { slotCount } = profile;
    if (slotCount === 0) {
      return (
        <div style={{ padding: '4px 12px' }}>
          <Caption>{t('workspace.hint.slots', { context: 'none' })}</Caption>
        </div>
      );
    } else if (slotCount < 5) {
      return (
        <div style={{ padding: '4px 12px' }}>
          <Caption>{t('workspace.hint.slots', { count: slotCount })}</Caption>
        </div>
      );
    }
  };

  const renderTabs = () => (
    <SegmentedControl style={{ maxHeight: 32, background: theme.secondary_bg_color }}>
      <SegmentedControl.Item onClick={switchBookinkKind('future')} selected={bookingsKind === 'future'}>
        {t('workspace.tabs.bookings', { context: 'future' })}
      </SegmentedControl.Item>
      <SegmentedControl.Item onClick={switchBookinkKind('past')} selected={bookingsKind === 'past'}>
        {t('workspace.tabs.bookings', { context: 'past' })}
      </SegmentedControl.Item>
    </SegmentedControl>
  );

  if (profileLoading) return <InfoPage type='loading'/>;
  if (!profile) return <InfoPage type='empty' />;

  return (
    <>
      {isIos && <Space />}
      
      <Section style={{ width: '100%' }}>
        <Cell
          style={{ background: theme.secondary_bg_color, padding: '8px 12px' }}
          onClick={go(`/preview/${profile.profileId}`)}
          subhead={<RatingBadge rating={profile?.rating}/>}
          before={<Avatar src={profile.photo} size={52}></Avatar>}
          after={<Navigation></Navigation>}
        >
          {profile?.name}
        </Cell>
      </Section>

      <Section style={{ width: '100%' }} footer={!isSlotsOpen && renderCalendarHint()}>
        <Cell
          style={{ background: theme.secondary_bg_color }}
          onClick={isSlotsOpen ? closeSlots : openSlots}
          before={!isSlotsOpen && <Calendar />}
          after={isSlotsOpen && <X />}
        >
          {isSlotsOpen ? t('button.close') : t('workspace.calendar')}
        </Cell>
      </Section>

      {!isSlotsOpen && renderTabs()}
     
      {isSlotsOpen && (
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
            selectedDate={selectedDate}
            showFullDay={showFullDay}
            onSlotClick={handleSlotClick}
            onToggleFullDay={handleToggleFullDay}
          />
        </>
      )}

      {selectedBooking && isSlotsOpen && <BookingCard isOwner={true} booking={selectedBooking}/>}

      {!isSlotsOpen && allBookings.length > 0 && (
        <GroupedVirtuoso
          ref={bookingList}
          components={{ Footer }}
          increaseViewportBy={{ top: 3, bottom: 3 }}
          groupCounts={groupedData.map(g => g.count)}
          style={{ width: "100%", height: '100%' }}
          groupContent={groupContent}
          itemContent={itemContent}
          endReached={loadMoreBookings}
          overscan={400}
        />
      )}

      {isSlotsOpen && <Space gap='120px'/>}

      {!isSlotsOpen && allBookings.length === 0 && (
          <>
            <InfoPage
              type='empty' 
              header={t('workspace.empty')} 
              text={t('workspace.empty', { context: 'description' })}
            />
            <Space gap='120px'/>
          </>
        )
      }

      <Menu />
    </>
  );
};