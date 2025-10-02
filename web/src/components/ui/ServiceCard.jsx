import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Section, Cell, Caption, IconButton, Button, Switch, Badge, Subheadline, Text, Info } from '@telegram-apps/telegram-ui';

import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';
import useTelegram from '@hooks/useTelegram';
import { Check, Clock, Edit, Trash, Calendar } from 'react-feather';
import { formatDate, getLocalTimeFromUTC } from '@helpers/time';

export default ({ service, isOwner, onClick, selected, onHandleSelect, selectedSlot, refetchServices }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { api } = useMetacom();
  const { account } = useAuth();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, showConfirm } = WebApp;

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const [fullDescription, setFulldescription] = useState(false);
  const renderDescription = (description) => {
    const more = <Caption style={{ color: theme.link_color }}>{` ...${t('common.more')}`}</Caption>
    const text = fullDescription || description.length <= 75 ? description : `${description.slice(0, 75)} `;
    const toggle = () => {
      HapticFeedback.selectionChanged();
      setFulldescription(!fullDescription);
    }
    return (
      <div onClick={toggle}>
        <Caption style={{ whiteSpace: 'pre-wrap' }}>{text}</Caption>
        {fullDescription || description.length <= 75 ? null : more}
      </div>
    )
  };

  const switchServiceState = useCallback((state) => async () => {
    HapticFeedback.impactOccurred('soft');
    if (state === 'arhived') {
      showConfirm(t('popup.confirm.service', { context: 'remove' }), (ok) => {
        if (ok) api.service.save({ ...service, state });;
      })
    } else {
      api.service.save({ ...service, state }).then(refetchServices);
    }
   
  }, [service]);

  const renderButton = () => {
    if (isOwner) {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton size='s' onClick={go(`/settings/services/edit/${service.serviceId}`)}><Edit /></IconButton>
          <IconButton size='s' onClick={switchServiceState('arhived')}><Trash /></IconButton>
        </div>
      );
    } else {
      const handler = onHandleSelect;
      const { datetime } = selectedSlot || {};
      const [date, fullTime] = datetime?.split('T') || [];
      const [week, day] = date ? formatDate(new Date(date)) : [];
      const time = getLocalTimeFromUTC(datetime);
      return (
        <Button
          size='s'
          before={selected && <Calendar size={16}/>}
          style={{ maxHeight: '32px', margin: '8px 0' }}
          onClick={handler}
        >
          <Caption weight='1'>
            {selected
              ? t('button.select', { context: selectedSlot ? 'checked' : 'slot', time, date: day }) 
              : t('button.select', { context: 'service' })
            }
          </Caption>
        </Button>
      );
    }
  }

  return (
    <Section style={{ width: '100%', border: selected ? `1.5px solid ${theme.link_color}` : 'none', borderRadius: '12px' }} onClick={onClick}>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        multiline
        after={renderButton()}
        subhead={
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {service.isOnline &&
              <Badge type='number' style={{ margin: 0 }}>
                <Caption>{t(`service.isOnline`)}</Caption>
              </Badge>
            }
            {service.isVisits &&
              <Badge type='number' style={{ margin: 0 }}>
                <Caption>{t(`service.isVisits`)}</Caption>
              </Badge>
            }
          </div>
        }
      >
        {service.name}
      </Cell>
      {service.description && <Cell 
        style={{ background: theme.secondary_bg_color }}
        multiline
      >
        {renderDescription(service.description)}
      </Cell>}
      {isOwner && 
        <Cell
          style={{ background: theme.secondary_bg_color }}
          after={
            <Switch 
              size='s' 
              onClick={switchServiceState(service.state === 'suspended' ? 'active' : 'suspended')}
              checked={service.state === 'active'}
            />
          }
        >
          {t('service.state', { context: service.state })}
        </Cell>
      }
      <Cell 
        style={{ background: theme.secondary_bg_color }}
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
            <Clock size={16}/>
            <Subheadline level='2'>
              {`${ service.allDay ? t('common.allDay') : t('common.minutes', { count: service.duration })}`}
            </Subheadline>
          </div>
        }
      >
        <Text weight='1' style={{ color: theme.text_color }}>
          {t('common.price', { price: service.price, context: !!Number(service.price) ? '' : 'free' })}
        </Text>
      </Cell>
    </Section>
  )
}