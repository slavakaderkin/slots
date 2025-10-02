import { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Caption, Button, Text, Avatar, Navigation, Info } from '@telegram-apps/telegram-ui';
import { Calendar } from 'react-feather';

import { formatDate, getLocalTimeFromUTC } from '@helpers/time';
import useTelegram from '@hooks/useTelegram';


const ClientCard = ({ client }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { WebApp } = useTelegram();
  const { HapticFeedback, themeParams: theme, openTelegramLink, } = WebApp;

  const { clientId, info } = client;
  const photo = info?.photo_url;
  const name = `${info?.first_name || ''} ${info?.last_name || ''}`.trim();
  const username = client?.info?.username;
  const telegramLink = username ? `https://t.me/${username}` : null;
  const toTelegram = telegramLink ? () => openTelegramLink(telegramLink) : null
   
  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  return (
    <Section style={{ width: '100%' }}>
      <Cell
        style={{ background: theme.secondary_bg_color, padding: '4px 12px' }}
        multiline
        subtitle={username && `@${username}`}
        after={<Navigation></Navigation>}
        before={<Avatar size={40} src={photo}/>}
        onClick={go(`/clients/${clientId}`)} //toTelegram && toTelegram}
      >
        {name}
      </Cell>

      {}
    </Section>
  );
};

export default ClientCard;