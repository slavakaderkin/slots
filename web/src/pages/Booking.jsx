import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Title, Text, Cell, Section, Caption, Textarea, IconButton, Button, Navigation } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useBackButton from '@hooks/useBackButton';
import useApiCall from '@hooks/useApiCall';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';

import InfoPage from '@pages/Info';
import BookingCard from '@components/ui/BookingCard';
import { Download, Send, Star, CheckCircle, Slash, MapPin, Copy } from 'react-feather';
import FeedbackCard from '../components/ui/FeedbackCard';

export default () => {
  const { account } = useAuth();
  const { bookingId } = useParams();
  const { api } = useMetacom();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, showConfirm, showAlert, openTelegramLink, openLink, requestWriteAccess } = WebApp;

  useBackButton();

  const [allowsWrite, setAllowsWrite] = useState(account?.info?.allows_write_to_pm);

  const handleAllowsWrite = useCallback(() => {
    HapticFeedback.impactOccurred('soft');
    requestWriteAccess((ok) => void setAllowsWrite(ok))
  }, [setAllowsWrite]);

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const { call: getBooking, data: booking, loading } = 
    useApiCall('booking.byId', { autoFetch: true, params: { bookingId } });

  const { call, data: feedback } = 
    useApiCall('feedback.byBooking', { autoFetch: true, params: { bookingId } });

  const { profile, client, state, service } = booking  || {};
  const isOwner = booking?.profile?.accountId === account.accountId;
  const isShowFeedback = (feedback && !isOwner) || (feedback && isOwner && !feedback.isAnonymous);
  const isShowFeedbackButton = !feedback && booking?.state === 'completed' && !isOwner;
  const isShowMeetLinkForm = (booking?.isOnline || service?.isOnline) && isOwner && booking?.state === 'confirmed';
  const isMeetLinkShow = !isOwner && booking?.meetLink && booking?.state === 'confirmed' ;

  const [updatingLink, setUpdatingLink] = useState(false);
  const [meetLink, setMeetLink] = useState('');

  useEffect(() => {
    if (booking) setMeetLink(booking?.meetLink);
  }, [booking]);

  const updateMeetLink = () => {
    if (!meetLink?.startsWith('http')) return;
    setUpdatingLink(true);
    api.booking.update({ bookingId, updates: { meetLink } })
      .then(() => {
        setUpdatingLink(false);
        showAlert(t('popup.alert.meetLink', { context: 'saved' }))
      })
  }

  const confirm = () => {
    HapticFeedback.impactOccurred('soft');
    showConfirm(t('popup.confirm.booking', { context: 'confirm' }), (ok) => {
      if (ok) api.booking.confirm({ bookingId }).then(getBooking);
    })
  };

  const cancel = () => {
    HapticFeedback.impactOccurred('soft');
    showConfirm(t('popup.confirm.booking', { context: 'cancel' }), (ok) => {
      if (ok) api.booking.cancel({ bookingId }).then(getBooking);
    })
  };

  const renderButtons = () => {
    if (['completed', 'cancelled'].includes(state)) return;
    if (state === 'pending') {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          {isOwner && <IconButton onClick={confirm}><CheckCircle /></IconButton>}
          <IconButton onClick={cancel}><Slash /></IconButton>
        </div>
      )
    }
    if (state === 'confirmed') return <IconButton onClick={cancel}><Slash /></IconButton>
  };

  const photo = isOwner ? client?.info?.photo_url : profile?.photo;
  const name = isOwner 
    ? `${client?.info?.first_name} ${client?.info?.last_name}` 
    : profile?.name;
  const role = !isOwner ? profile?.specialization : t('booking.role', { context: 'client' });
  const username = client?.info?.username;
  const telegramLink = username ? `https://t.me/${username}` : null;

  const handler = isOwner 
    ? telegramLink ? () => openTelegramLink(telegramLink) : null
    : go (`/profile/${profile?.profileId}`);

  const openMapLink = () => {
    showConfirm(t('popup.confirm.profile', { context: 'map' }), (ok) => {
      if (ok)  openLink(profile?.mapLink, { try_instant_view: true })
    });
  };

  const renderAddress = () => (
    <Cell
      after={profile?.mapLink && 
        <IconButton onClick={openMapLink}>
          <MapPin />
        </IconButton>
      }
      style={{ background: theme.secondary_bg_color }}
      subhead={t('profile.address')}
      multiline
    >
      {profile?.address}
    </Cell>
  );

  const copyLink = () => {
    if (!booking?.meetLink) return;
    
    // Копируем в буфер обмена
    navigator.clipboard.writeText(booking.meetLink)
      .then(() => {
        HapticFeedback.impactOccurred('soft');
        showAlert(t('popup.alert.meetLink', { context: 'copied' }));
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showAlert(t('popup.alert.error'));
      });
  };

  if (loading || !booking) return <InfoPage type='loading'/>;

  return (
    <>
      {isIos && <Space />}

      <Section style={{ width: '100%' }}>
       <div 
          style={{ 
            width: '100%', 
            background: theme.secondary_bg_color, 
            borderRadius: '12px',
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          <img src={photo} style={imageStyle} />
          <Cell
            style={{ background: theme.secondary_bg_color }}
            multiline
            onClick={handler}
            after={handler && <Navigation></Navigation>}
            subhead={role}
          >
            <Title level='2' weight='2'>{name}</Title>
          </Cell>
        </div>
        {!isOwner && profile?.address && renderAddress()}
        {booking?.comment && 
          <Cell
            multiline
            style={{ background: theme.secondary_bg_color }}
            subhead={t('booking.comment')}
          >
            {booking?.comment}
          </Cell>
        }
        {isMeetLinkShow &&
          <Cell 
            multiline 
            subhead={t('booking.meetLink')} 
            style={{ background: theme.secondary_bg_color }}
            onClick={copyLink}
            after={<IconButton><Copy /></IconButton>}
          >
            <Text style={{ whiteSpace: 'pre-wrap' }}>{booking?.meetLink}</Text>
          </Cell>
        }
        <Cell
          style={{ background: theme.secondary_bg_color }}
          subhead={t('booking.state')}
          after={renderButtons()}
        >
          {t('booking.state', { context: state })}
        </Cell>
      </Section>

      {!isOwner && !account?.info?.allows_write_to_pm && !allowsWrite &&
        <Section style={{ width: '100%' }}>
          <Cell
            style={{
              background: theme.secondary_bg_color,
              border: `1px solid ${theme.link_color}`,
            }}
            multiline
            description={t('common.allowsWrite')}
            after={
              <Button
                size='s'
                style={{ maxHeight: '32px', margin: '8px 0' }}
                onClick={handleAllowsWrite}
              >
                <Caption weight='1'>
                  {t('button.allowsWrite')}
                </Caption>
              </Button>}
          >
          </Cell>
        </Section>
      }

      <BookingCard
        booking={booking}
        isOwner={isOwner}
        selected={true}
      />

      {isShowMeetLinkForm && 
        <Section style={{ width: '100%' }} header={t('booking.meetLink')}>
          <Textarea placeholder={t('common.writeHere')} value={meetLink} onChange={({ target }) => void setMeetLink(target.value)}/>
        </Section>
      }
      {isShowFeedback && <FeedbackCard feedback={feedback} single my={!isOwner}/>}

      <Space gap='120px'/>
      
      {isShowFeedbackButton &&
        <MainButton
          text={t('button.feedback')}
          handler={go(`/feedback/${bookingId}`)}
        />
      }
      {isShowMeetLinkForm &&
        <MainButton
          loading={updatingLink}
          disabled={updatingLink || !meetLink?.startsWith('http')}
          text={t('button.meetLink')}
          handler={updateMeetLink}
        />
      }
    </>
  )
};

const imageStyle = {
  objectFit: 'cover',
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: '10px 10px 0 0',
  padding: 0,
  margin: 0,
  bottom: 0,
};

