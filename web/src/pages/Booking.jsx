import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Title, Subheadline, Cell, Section, Caption, Text, IconButton, Button, Navigation } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';
import useBackButton from '@hooks/useBackButton';
import useApiCall from '@hooks/useApiCall';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';

import InfoPage from '@pages/Info';
import BookingCard from '@components/ui/BookingCard';
import { Download, Send, Star, CheckCircle, Slash } from 'react-feather';
import FeedbackCard from '../components/ui/FeedbackCard';

export default () => {
  const { account } = useAuth();
  const { bookingId } = useParams();
  const { api } = useMetacom();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, showConfirm, openTelegramLink, requestWriteAccess } = WebApp;

  if (location.key !== 'default') useBackButton();

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

  if (loading || !booking) return <InfoPage type='loading'/>;

  const { profile, client, state } = booking  || {};
  const isOwner = booking?.profile?.accountId === account.accountId;

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
  const role = t('booking.role', { context: isOwner ? 'client' : 'profile' });
  const username = client?.info?.username;
  const telegramLink = username ? `https://t.me/${username}` : null;

  const handler = isOwner 
    ? telegramLink ? () => openTelegramLink(telegramLink) : null
    : go (`/profile/${profile.profileId}`);

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
            subtitle={isOwner 
              ? <Subheadline style={{ color: theme.link_color }}>{`@${username}`}</Subheadline> 
              : profile?.specialization
            }
          >
            <Title level='2' weight='2'>{name}</Title>
          </Cell>
        </div>

        {booking?.comment && 
          <Cell
            multiline
            style={{ background: theme.secondary_bg_color }}
            subhead={t('booking.comment')}
          >
            {booking?.comment}
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

      {/** MeettLink */}
      {(feedback && !isOwner) || (feedback && isOwner && !feedback.isAnonymous) && <FeedbackCard feedback={feedback} single my={!isOwner}/>}

      <Space gap='120px'/>
      
      {!feedback && booking?.state === 'completed' && 
        <MainButton
          text={t('button.feedback')}
          handler={go(`/feedback/${bookingId}`)}
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

