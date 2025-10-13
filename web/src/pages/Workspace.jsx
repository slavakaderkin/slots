import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { 
  Section, 
  Cell, 
  Avatar, 
  Caption, 
  Text, 
  SegmentedControl, 
  Navigation, 
  Subheadline,
  InlineButtons,
  Button
} from '@telegram-apps/telegram-ui';
import { GroupedVirtuoso } from 'react-virtuoso';
import { Player } from '@lottiefiles/react-lottie-player';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useApiCall from '@hooks/useApiCall';

import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';
import BookingCard from '@components/ui/BookingCard';
import ProfileHeader from '@components/ui/ProfileHeader';
import SubscriptionBanner from '@components/ui/SubscriptionBanner';

import InfoPage from '@pages/Info';

const BOOKINGS_PER_PAGE = 10;

export default () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { api } = useMetacom();
  const { account, token } = useAuth();
  const { unactiveProfile, subscription, trial, profile } = account;
  const subscribtionEndDate = subscription?.end || trial?.end;
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;
  const bookingList = useRef(null);

  const [isSlotsOpen, setIsSlotsOpen] = useState(false);
  const [selectedBooking, setSlotBooking] = useState(null);
  const [slotAction, setSlotAction] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  const [bookingsKind, setBookingsKind] = useState('future');

  const switchBookinkKind = (kind) => () => {
    HapticFeedback.impactOccurred('soft');
    setBookingsKind(kind)
    loadInitialBookings(kind);
  }

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
      if (groupDate.getTime() >= today.getTime()) return totalBefore;
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
    if (profile) loadInitialBookings(bookingsKind);
  }, [profile, bookingsKind]);

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


  const go = useCallback((path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  }, [HapticFeedback, navigate]);


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

  return (
    <>
      {isIos && <Space />}
      {profile && <SubscriptionBanner />}
      {profile && <ProfileHeader />}
  
      {profile && renderTabs()}

      {allBookings.length > 0 && (
        <GroupedVirtuoso
          ref={bookingList}
          components={{ Footer: () => <Space gap='150px'/> }}
          increaseViewportBy={{ top: 3, bottom: 3 }}
          groupCounts={groupedData.map(g => g.count)}
          style={{ width: "100%", height: '100%' }}
          groupContent={groupContent}
          itemContent={itemContent}
          endReached={loadMoreBookings}
          overscan={400}
        />
      )}

      {allBookings.length === 0 && profile &&
        <>
          <InfoPage
            type='empty' 
            header={t('workspace.empty', { context: bookingsKind })} 
            text={t('workspace.empty', { context: 'description' })}
          />
          <Space gap='120px'/>
        </>
      }

      {!profile && 
        <>
          <InfoPage
            type='empty' 
            header={t('workspace.empty', { context: 'profile' })} 
            button={
              <Button onClick={ go((subscription?.isActive || trial?.isActive) ? '/settings' : '/promo')}>
                {t('button.create')}
              </Button>
            }
          />
          <Space gap='120px'/>
        </>
      }

    </>
  );
};