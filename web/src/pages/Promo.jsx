import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, Button, Placeholder } from '@telegram-apps/telegram-ui';
import { Player } from '@lottiefiles/react-lottie-player';

import useTelegram from '@hooks/useTelegram';
import useBackButton from '@hooks/useBackButton';
import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';

import mainAnimation from '../assets/animation/promo_main.json'

export default () => {
  const { account, init } = useAuth();
  const { api } = useMetacom();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, openInvoice, showAlert } = WebApp;
  const { trial, subscription, accountId } = account;
  const [type, setType] = useState('month');
  const [level, setLevel] = useState('min');
  const [loading, setLoading] = useState(false);

  useBackButton()

  const switchType = useCallback(() => {
    setType(type === 'month' ? 'year' : 'month');
  }, [type]);

  const switchLevel = useCallback(() => {
    setType(level === 'min' ? 'max' : 'min');
  }, [level]);

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
  )
  
  return (
    <>
      {isIos && <Space />}
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

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
        
        
      </div>  

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