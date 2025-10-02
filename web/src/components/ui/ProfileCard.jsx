import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Caption, Button, Text, Avatar, Navigation, Info } from '@telegram-apps/telegram-ui';
import { Calendar } from 'react-feather';

import { formatDate, getLocalTimeFromUTC } from '@helpers/time';
import useTelegram from '@hooks/useTelegram';


const ProfileCard = ({ profile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { WebApp } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;

  const { profileId, name, upcomingSlot, category, photo, specialization } = profile;
  const handleNavigate = useCallback((path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  }, []);

  const renderSlot = useCallback((slot) => {
    if (!slot?.datetime) return null;

    const [date] = slot.datetime.split('T');
    const [, day] = formatDate(new Date(date));
    const time = getLocalTimeFromUTC(slot.datetime);

    return (
      <Button
        size="s"
        before={<Calendar size={16} />}
        style={{ maxHeight: '28px', margin: '8px 0' }}
      >
        <Caption weight="1">
          {t('button.select', { context: 'checked', time, date: day })}
        </Caption>
      </Button>
    );
  }, []);

  return (
    <Section style={{ width: '100%' }}>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        multiline
        after={<Navigation></Navigation>}
        before={<Avatar src={photo}/>}
        onClick={handleNavigate(`/profile/${profileId}`)}
        subhead={specialization}
      >
        {name}
      </Cell>
      <Cell style={{ background: theme.secondary_bg_color }} after={renderSlot(upcomingSlot)}>
        {upcomingSlot ? t('profile.upcomingSlot') : t('profile.noSlots')}
      </Cell>
    </Section>
  );
};

export default ProfileCard;