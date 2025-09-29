import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Blockquote, Caption, Button, Text, Avatar } from '@telegram-apps/telegram-ui';
import { Star } from 'react-feather';

import { formatDate, getLocalTimeFromUTC } from '@helpers/time';
import useTelegram from '@hooks/useTelegram';

const renderStars = (rating) => {
  const totalStars = 5;
  const stars = [];
  const color = rating < 3 ? '#ff3b30' : '#ffbe0d';

  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        color={color}
        fill={i <= rating ? color : 'none'}
        style={{ marginRight: 2 }}
      />
    );
  }
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {stars}
    </div>
  );
};

export default ({ feedback, single = false, my = false }) => {
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { themeParams: theme } = WebApp;

  const { text, rating, user, date , service } = feedback;

  return (
    <Section style={{ minWidth: single ? '100%' : '320px' }} header={single && t('booking.feedback', { context: my ? 'my' : '' })}>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        multiline
        subhead={renderStars(rating)}
        subtitle={<Caption style={{ minWidth: '140px' }}>{t('common.date', { date: new Date(date), formatParams: { date: { month: 'long', day: 'numeric', year: 'numeric' } } })}</Caption>}
      >
        {service?.name}
      </Cell>
      
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={user && <Avatar src={user?.photo_url} size={24}/>}
        multiline
        description={<Blockquote style={{ minWidth: '200px' }}>{text}</Blockquote>}
      >
        
      </Cell>
    </Section>
  );
};
