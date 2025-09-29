import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Section, Cell, Avatar, Navigation, Text, TabsList, SegmentedControl, Banner, Button, IconButton, Caption, Subheadline, Snackbar } from '@telegram-apps/telegram-ui';
import { GroupedVirtuoso } from 'react-virtuoso';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useApiCall from '@hooks/useApiCall';

import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';
import BookingCard from '@components/ui/BookingCard';
import ProfileCard from '@components/ui/ProfileCard';
import InfoPage from '@pages/Info';
import { Calendar, X } from 'react-feather';

const BOOKINGS_PER_PAGE = 30;

export default () => {
  const { account , token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;
  const { info } = account;
  const [mode, setMode] = useState('bookings');
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  const switchMode = useCallback((mode) => () => {
    HapticFeedback.impactOccurred('soft');
    setMode(mode);
  }, []);

  const bookingList = useRef(null);

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allBookings, setAllBookings] = useState([]);

  const { data: profile, loading: profileLoading } = 
    useApiCall('profile.my', { autoFetch: true });

  const { call: getBookings, loading: bookingsLoading, error } = 
    useApiCall('booking.byAccount', { autoFetch: false });

  const { call: getProfiles, data: profiles, loading: profielsLoading } = 
    useApiCall('profile.list', { autoFetch: true });

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
      limit: BOOKINGS_PER_PAGE,
      offset: 0
    });
    
    if (result) {
      setAllBookings(result);
      setHasMore(result.length === BOOKINGS_PER_PAGE);
      setOffset(BOOKINGS_PER_PAGE);
    }
  }, [getBookings]);

  useEffect(() => {
    loadInitialBookings().then(scrollToToday);
  }, []);

  const loadMoreBookings = useCallback(async () => {
    if (bookingsLoading || !hasMore) return;

    try {
      const result = await getBookings({ 
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
        <BookingCard key={`booking_${index}_${booking.bookingId}`} booking={booking}/>
      </div>
    );
  }, [getBookingByGlobalIndex]);


  const renderTabs = () => (
    <SegmentedControl style={{ maxHeight: 32, background: theme.secondary_bg_color }}>
      <SegmentedControl.Item onClick={switchMode('bookings')} selected={mode === 'bookings'}>
        {t('account.tabs.bookings')}
      </SegmentedControl.Item>
      <SegmentedControl.Item onClick={switchMode('profiles')} selected={mode === 'profiles'}>
        {t('account.tabs.profiles')}
      </SegmentedControl.Item>
    </SegmentedControl>
  );

  const closeBanner = () => {
    setIsBannerOpen(false);
  }

  if (profileLoading) return <InfoPage type='loading'/>

  const snackBarStyle = {
    borderRadius: '10px',
    border: `1px solid ${theme.link_color}`
  };

  return (
    <>
      {isIos && <Space />}

      {!profile && isBannerOpen && 
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '10px',
            //padding: '0 8px',
            margin: '0 12px',
            border: `1px solid ${theme.link_color}`
          }}
        > 
          <div onClick={go('/settings')} style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Subheadline>{t('account.cta.header')}</Subheadline>
            <Caption >{t('account.cta.description')}</Caption>
          </div>
          <div  style={{ padding: '0 12px' }} onClick={closeBanner}><X size={12}/></div>
        </div>
      }
      
      <Section style={{ width: '100%' }}>
        <Cell
          style={{ background: theme.secondary_bg_color }}
          subhead={t('common.you')}
          before={<Avatar src={info.photo_url}/>}
          //after={}
        >
          {`${info.first_name} ${info.last_name}`}
        </Cell>
      </Section>

      {renderTabs()}
    
      {allBookings.length > 0 && mode === 'bookings' && <GroupedVirtuoso
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

      {profiles?.length > 0 && mode === 'profiles' &&
        profiles.map((profile) => <ProfileCard key={profile.profileId} profile={profile}/>)
      }

      {mode === 'bookings' && allBookings.length === 0 && (
        <>
          <InfoPage 
            type='empty' 
            header={t('account.empty', { context: mode })} 
          />
          <Space />
        </>
       )
      }

      {mode === 'profiles' && profiles?.length === 0 && (
        <>
          <InfoPage 
            type='empty' 
            header={t('account.empty', { context: mode })} 
          />
          <Space />
        </>
       )
      }

      {profile && <Menu />}
    </>

  )
};
