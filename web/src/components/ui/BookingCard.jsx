import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Caption, Button, Subheadline, Text, Avatar, Navigation, Badge } from '@telegram-apps/telegram-ui';
import { Calendar } from 'react-feather';

import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';
import useTelegram from '@hooks/useTelegram';
import { formatDate, getLocalTimeFromUTC } from '@helpers/time';
import { Clock } from 'react-feather';

const BookingCard = ({ isOwner, selected, booking, clickable = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account } = useAuth();
  const { WebApp } = useTelegram();
  const { HapticFeedback, themeParams: theme, openTelegramLink } = WebApp;

  const [isFullDescription, setIsFullDescription] = useState(false);

  const { service, slot, client, profile, bookingId, state } = booking;
  console.log("🚀 ~ BookingCard ~ client:", client)

  const stateColors = {
    confirmed: theme.link_color,
    pending: theme.text_color,
    completed: '#eb8218',
  };

  const themeStyles = useMemo(() => ({
    section: {
      width: '100%',
      //border: selected ? `1.5px solid ${theme.link_color}` : 'none',
      borderRadius: '12px'
    },
    status: { 
      color: stateColors[state] || theme.hint_color,
      //border: `1.5px solid ${stateColors[state] || theme.hint_color}`,
      //borderRadius: '12px',
      //padding: '4px'
    },
    cell: { background: theme.secondary_bg_color },
    link: { color: theme.link_color },
    text: { color: theme.text_color }
  }), [theme, selected]);

  // Обработчики
  const handleNavigate = useCallback((path) => () => {
    if (selected || !clickable) return;
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  }, []);

  const handleToggleDescription = useCallback(() => {
    HapticFeedback.selectionChanged();
    setIsFullDescription(prev => !prev);
  }, []);

  const handleTelegramLink = useCallback((username) => () => {
    if (!clickable) return;
    openTelegramLink(`https://t.me/${username}`);
  }, [openTelegramLink]);

  // Вспомогательные функции рендера
  const renderDescription = useCallback((description) => {
    const maxLength = 75;
    const shouldTruncate = !isFullDescription && description.length > maxLength;
    const displayText = shouldTruncate ? `${description.slice(0, maxLength)} ` : description;

    return (
      <div onClick={handleToggleDescription}>
        <Caption style={{ whiteSpace: 'pre-wrap' }}>{displayText}</Caption>
        {shouldTruncate && (
          <Caption style={themeStyles.link}>{` ...${t('common.more')}`}</Caption>
        )}
      </div>
    );
  }, [isFullDescription, handleToggleDescription, themeStyles.link, t]);

  const renderSlot = useCallback(() => {
    if (!slot?.datetime || !clickable) return null;

    const [date] = slot.datetime.split('T');
    const [, day] = formatDate(new Date(date));
    const time = getLocalTimeFromUTC(slot.datetime);

    return (
      <Button
        size="s"
        before={<Calendar size={16} />}
        style={{ maxHeight: '32px', margin: '8px 0' }}
      >
        <Caption weight="1">
          {t('button.select', { context: 'checked', time, date: day })}
        </Caption>
      </Button>
    );
  }, [slot, selected, t]);

  const renderUserInfo = useCallback(() => {
    if (selected) return null;

    const photo = isOwner ? client?.info?.photo_url : profile?.photo;
    const name = isOwner 
      ? `${client?.info?.first_name || ''} ${client?.info?.last_name || ''}`.trim()
      : profile?.name || '';
    
    const role = isOwner ? t('booking.role', { context: 'client' }) : profile?.specialization;
    const username = client?.info?.username;

    const handler = isOwner 
      ? username ? handleTelegramLink(username) : null
      : handleNavigate(`/profile/${profile?.profileId}`);

    return (
      <Cell 
        style={themeStyles.cell}
        subhead={<Caption>{role}</Caption>}
        onClick={handler && clickable && handler}
        before={photo && <Avatar size={32} src={photo} />}
        after={
          handler && clickable && (
            <Navigation>
              {isOwner && username && (
                <Subheadline style={themeStyles.link}>
                  {`@${username}`}
                </Subheadline>
              )}
            </Navigation>
          )
        }
      >
        <Subheadline level="2">{name || t('common.anonymous')}</Subheadline>
      </Cell>
    );
  }, [isOwner, client, profile, selected, themeStyles, handleTelegramLink, handleNavigate]);

  const renderDuration = useCallback(() => (
    <div
      style={{ 
        padding: '8px', 
        minWidth: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px' 
      }}
    >
      <Clock size={16}/>
      <Subheadline level='2'>
        {`${ service.allDay 
          ? t('common.allDay') 
          : t('common.minutes', { count: service.duration })}`
        }
      </Subheadline>
    </div>
  ), [service.allDay, service.duration, t]);

  const renderStatus = useCallback(() => {
    if (selected) return;
    return (
      <Caption style={themeStyles.status}>
        {t('booking.state', { context: booking?.state })}
      </Caption>
    )
  }, [])

  const renderOnlineBadge = useCallback(() => (
    service.isOnline ? (
      <Badge type="number" style={{ margin: 0 }}>
        <Caption>{t('service.isOnline')}</Caption>
      </Badge>
    ) : null
  ), [service.isOnline, t]);

  // Основной рендер
  return (
    <Section style={themeStyles.section} header={(selected || !clickable) && t('profile.booking')}>
      {/* Заголовок сервиса */}
      <Cell
        style={themeStyles.cell}
        multiline
        after={renderSlot()}
        onClick={handleNavigate(`/bookings/${bookingId}`)}
        subhead={renderOnlineBadge()}
        subtitle={renderStatus()}
      >
        {service.name}
      </Cell>

      {/* Информация о пользователе */}
      {renderUserInfo()}

      {/* Описание (только для выбранного) */}
      {selected && (
        <Cell style={themeStyles.cell} multiline>
          {renderDescription(service.description)}
        </Cell>
      )}
      
      {/* Цена и длительность */}
      <Cell style={themeStyles.cell} after={renderDuration()}>
        <Text weight="1" style={themeStyles.text}>
          {t('common.price', { price: service.price })}
        </Text>
      </Cell>
    </Section>
  );
};

export default BookingCard;