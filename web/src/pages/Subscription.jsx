import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, Button, Text, Title, Section, Cell, Subheadline, IconButton } from '@telegram-apps/telegram-ui';
import { Player } from '@lottiefiles/react-lottie-player';

import useTelegram from '@hooks/useTelegram';
import useBackButton from '@hooks/useBackButton';
import useMetacom from '@hooks/useMetacom';
import useAuth from '@hooks/useAuth';
import useApiCall from '@hooks/useApiCall';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';

import { ChevronRight, Slash } from 'react-feather';
import PremiumBotBanner from '@components/ui/PremiumBotBanner';
import ReferalProgram from '@components/ui/ReferalProgram';

export default () => {
  const { account, init } = useAuth();
  const { api } = useMetacom();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme, openInvoice, showAlert, showConfirm } = WebApp;
  const { accountId } = account;
 
  useBackButton();

  const { subscription, trial } = account;
  const { payments = [], lastPayment } = subscription || {};
  const hasActiveSubscription = subscription?.isActive && !subscription?.isCancelled;
  const isMonthSubscription = hasActiveSubscription && lastPayment?.type === 'month';
  const subscribtionEndDate = subscription?.end || trial?.end;
  const formatParams = { date: { day: 'numeric', month: 'long', year: 'numeric' } };

  const [type, setType] = useState(isMonthSubscription ? 'year' : 'month');
  const [level, setLevel] = useState('min');
  const [loading, setLoading] = useState(false);

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

  const mainButtonText = t('button.extend', { count: prices[type], context: type });

  const mainButtonHandler = useCallback(() => {
    setLoading(true);
    api.subscription.pay({ level, type, accountId })
      .then((invoice) => {
        openInvoice(invoice, async (status) => {
          setLoading(false);
          if (status === 'paid') await init();
          showAlert(t('popup.alert.payment.status', { context: status }));
        })
      });
   
  }, [level, type]);

  const renderTabs = () => (
    <SegmentedControl style={{ maxHeight: 32, background: theme.secondary_bg_color, marginBottom: '12px' }}>
      <SegmentedControl.Item onClick={switchType('month')} selected={type === 'month'}>
        {t('promo.tab.month')}
      </SegmentedControl.Item>
      <SegmentedControl.Item onClick={switchType('year')} selected={type === 'year'}>
        {t('promo.tab.year')}
      </SegmentedControl.Item>
    </SegmentedControl>
  );

  const cancel = () => {
    HapticFeedback.impactOccurred('soft');
    showConfirm(t('popup.confirm.subscription', { context: 'cancel' }), (ok) => {
      if (ok) {
        const { subscriptionId, accountId } = subscription;
        const args = { subscriptionId, accountId, refund: true };
        api.subscription.cancel(args)
          .then(async () => {
            await init();
            showAlert(t('popup.alert.subscription.cancelled'));
          
        });
      }
    })
  };


  return (
    <>
      {isIos && <Space />}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <Title>{t('common.date', { date: new Date(subscribtionEndDate), formatParams, context: 'subscription' })}</Title>

        {trial?.isActive && !subscription &&
          <Section style={{ width: '100%' }}>
            <Cell
              style={{ background: theme.secondary_bg_color }}
            >
              <Text weight='1'>{t('subscription.trial')}</Text>
            </Cell>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              after={<Text>{t('common.date', { date: new Date(trial.start), formatParams })}</Text>}
            >
              {t('subscription.start')}
            </Cell>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              after={<Text>{t('common.date', { date: new Date(trial.end), formatParams })}</Text>}
            >
              {t('subscription.end')}
            </Cell>
          </Section>
        }

        {subscription &&
          <Section style={{ width: '100%' }}>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              subtitle={
                <Text style={{ color: subscription?.isActive ? theme.link_color : theme.destructive_text_color }}>
                  {subscription?.isCancelled ? t('subscription.status', { context: 'cancelled' }) : t('subscription.status', { context: subscription?.isActive ? 'active' : 'ended' })}
                </Text>
              }
              after={isMonthSubscription && <IconButton onClick={cancel}><Slash /></IconButton>}
            >
              <Text weight='1'>{t('subscription.subscription')}</Text>
            </Cell>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              multiline
              description={t('subscription.type', { context: lastPayment?.type })}
              after={<Text>{t(`subscription.${lastPayment?.type}`)}</Text>}
            >
              {t('subscription.type')}
            </Cell>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              after={<Text>{t('common.date', { date: new Date(subscription.start), formatParams })}</Text>}
            >
              {t('subscription.start')}
            </Cell>
            <Cell
              style={{ background: theme.secondary_bg_color }}
              after={<Text>{t('common.date', { date: new Date(subscription.end), formatParams })}</Text>}
            >
              {isMonthSubscription ? t('subscription.next') : t('subscription.end')}
            </Cell>
          </Section>
        }


        <PremiumBotBanner />
        <ReferalProgram />
      </div>
      
      <Space gap={(!trial && !subscription) ? '200px' : '150px'} />

      <MainButton
        loading={loading}
        disabled={loading}
        text={mainButtonText}
        handler={mainButtonHandler}
      >
        {!isMonthSubscription && renderTabs()}
      </MainButton>
    </>

  )
}