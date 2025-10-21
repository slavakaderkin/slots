import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Caption, Button, Text, Avatar, Navigation, Info } from '@telegram-apps/telegram-ui';
import { Calendar } from 'react-feather';

import { formatDate, getLocalTimeFromUTC } from '@helpers/time';
import useTelegram from '@hooks/useTelegram';


const ClientReferer = ({ info }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { WebApp } = useTelegram();
  const { HapticFeedback, themeParams: theme, openTelegramLink, } = WebApp;

  const { photo_url: photo, first_name, last_name, username } = info || {};
  const name = `${first_name || ''} ${last_name || ''}`.trim();
  const telegramLink = username ? `https://t.me/${username}` : null;
  const toTelegram = telegramLink ? () => openTelegramLink(telegramLink) : null
   
  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  return (
      <Cell
        style={{ background: theme.secondary_bg_color }}
        after={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar  onClick={toTelegram && toTelegram} size={24} src={photo}/>
          {<Caption>{name}</Caption>}
        </div>}
      >
        {t('client.referer')}
      </Cell>
  );
};

export default ClientReferer;