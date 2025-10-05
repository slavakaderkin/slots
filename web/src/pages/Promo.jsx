import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, Button, Placeholder, Section, Cell, Subheadline } from '@telegram-apps/telegram-ui';
import { Player } from '@lottiefiles/react-lottie-player';

import useTelegram from '@hooks/useTelegram';
import useBackButton from '@hooks/useBackButton';
import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';

import { ChevronRight } from 'react-feather';

import mainAnimation from '../assets/animation/promo_main.json'
import one from '../assets/animation/promo_one.json';
import two from '../assets/animation/promo_two.json';
import three from '../assets/animation/promo_three.json';
import four from '../assets/animation/promo_four.json';
import five from '../assets/animation/promo_five.json';
import six from '../assets/animation/promo_six.json';
import seven from '../assets/animation/promo_seven.json';
import eight from '../assets/animation/promo_eight.json';

const sections = { one, two, three, four, five, six, seven, eight };

export default () => {
  const { account, init } = useAuth();
  const { api } = useMetacom();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, openInvoice, showAlert, openTelegramLink} = WebApp;
  const { trial, subscription, accountId } = account;
  const [type, setType] = useState('month');
  const [level, setLevel] = useState('min');
  const [loading, setLoading] = useState(false);

  useBackButton()

  const switchType = useCallback((type) => () => {
    HapticFeedback.selectionChanged();
    setType(type);
  }, [type]);

  const prices = {
    month: 350,
    year: 2500,
  };

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const mainButtonText = t('button.subscription', { count: prices[type], context: type });
  const secondButtonText = t('button.trial');

  const mainButtonHandler = useCallback(() => {
    setLoading(true);
    api.subscription.pay({ level, type, accountId })
      .then((invoice) => {
        openInvoice(invoice, async (status) => {
          setLoading(false);
          showAlert(t('popup.alert.payment.status', { context: status }));
          if (status === 'paid') init().then(() => void navigate('/settings', { replace: true }));
        })
      });
   
  }, [level, type]);

  const secondButtonHandler = useCallback(() => {
    api.subscription.startTrial({ accountId }).then((ok) => {
      if (ok) {
        showAlert(t('popup.alert.trial.status', { context: 'success' }));
        init().then(() => void navigate('/settings', { replace: true }));
      } else {
        showAlert(t('popup.alert.trial.status', { context: 'failed' }));
      }
    });
  }, []);

  const renderSecondButton = () => (
    <Button
      loading={loading}
      stretched={true}
      mode='outline'
      size='l'
      disabled={loading}
      onClick={secondButtonHandler}
      style={{ marginBottom: '16px' }}
    >
      {secondButtonText}
    </Button>
  );

  const renderTabs = () => (
    <SegmentedControl style={{ maxHeight: 32, background: theme.secondary_bg_color }}>
      <SegmentedControl.Item onClick={switchType('month')} selected={type === 'month'}>
        {t('promo.tab.month')}
      </SegmentedControl.Item>
      <SegmentedControl.Item onClick={switchType('year')} selected={type === 'year'}>
        {t('promo.tab.year')}
      </SegmentedControl.Item>
    </SegmentedControl>
  );

  return (
    <>
      {isIos && <Space />}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <Placeholder 
          header={t('promo.header')}
          description={t('promo.description')}
        >
          <Player
            src={mainAnimation}
            loop
            autoplay
            style={{ width: 150, height: 150 }}
          />
        </Placeholder>

        {renderTabs()}
        <div
          onClick={() => openTelegramLink('https://t.me/PremiumBot')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '10px',
            //background: '#eb8218',
            margin: '12px',
            border: `1px solid ${theme.link_color}`
          }}
        > 

          <div style={{ padding: '12px' }}><Subheadline>{t('promo.stars')}</Subheadline></div>
          <div style={{ padding: '12px' }}><ChevronRight size={20}/></div>
        </div>
      </div>
    
      <Section>
        {Object.entries(sections).map(([key, data]) => {
          return (
            <Cell
              key={key}
              multiline
              before={
                <Player
                  src={data}
                  loop
                  autoplay
                  style={{ width: 48, height: 48 }}
                />
              }
              description={t(`promo.${key}.description`)}
            >
              {t(`promo.${key}.header`)}
            </Cell>
          )
        })}
      </Section>

      <Space gap={(!trial && !subscription) ? '200px' : '120px'} />

      <MainButton
        loading={loading}
        disabled={loading}
        text={mainButtonText}
        handler={mainButtonHandler}
      >
        {!trial && !subscription && renderSecondButton()}
      </MainButton>
    </>

  )
}