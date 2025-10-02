import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Subheadline, Text } from '@telegram-apps/telegram-ui';

import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';
import useTelegram from '@hooks/useTelegram';
import { Check, Clock, Edit, Trash, Calendar } from 'react-feather';

export default ({ service, selected, onHandleSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { WebApp, isIos } = useTelegram();
  const { themeParams: theme } = WebApp;

  return (
    <Section 
      style={{ 
        width: '250px',
        border: selected ? `1.5px solid ${theme.link_color}` : 'none', 
        borderRadius: '12px' 
      }} 
      onClick={onHandleSelect}
    >
      <Cell>
        {service.name}
      </Cell>
     
      <Cell
        after={
          <div
            style={{ 
              padding: '8px', 
              minWidth: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px' 
            }}
          >
            <Subheadline level='2'>
              {`${ service.allDay ? t('common.allDay') : t('common.minutes', { count: service.duration })}`}
            </Subheadline>
          </div>
        }
      >
        <Text weight='1' style={{ color: theme.text_color }}>
          {t('common.price', { price: service.price, context: Number(service.price) ? '' : 'free' })}
        </Text>
      </Cell>
    </Section>
  )
}