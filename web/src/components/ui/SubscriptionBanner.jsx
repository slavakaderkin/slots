import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Caption, Subheadline } from '@telegram-apps/telegram-ui';
import { ChevronRight } from 'react-feather';
import { Player } from '@lottiefiles/react-lottie-player';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';

import animation from '../../assets/animation/expired.json';

const SubscriptionBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { account } = useAuth();
  
  const { unactiveProfile, subscription, trial } = account;
  const subscribtionEndDate = subscription?.end || trial?.end;
  const { themeParams: theme, HapticFeedback, openLink } = WebApp;

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const renderSubscriptionDate = () => {
    if (!subscribtionEndDate) return null;
    
    const formatParams = { date: { day: 'numeric', month: 'long', year: 'numeric' } };
    const date = new Date(subscribtionEndDate);
    const text = unactiveProfile ? 
      t('workspace.sub.expired') :
      t('workspace.sub.referal', { date, formatParams });
    return <Caption>{text}</Caption>;
  };

  if (!unactiveProfile && !subscribtionEndDate) return null;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        background: unactiveProfile ? '#fcf5e2' : theme.secondary_bg_color,
        margin: '0 12px',
        border: unactiveProfile ? `1px solid ${theme.link_color}` : 'none',
        cursor: 'pointer'
      }}
      onClick={unactiveProfile ? go('/promo') : go('/subscription')}
    >
      {unactiveProfile && (
        <Player
          src={animation}
          loop
          autoplay
          style={{ padding: '0 0 0 12px', width: 54, height: 54 }}
        />
      )}
      
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
      {unactiveProfile && <Subheadline style={{ color: unactiveProfile ? '#000000' : theme.text_color }}>{t('workspace.sub.expired')}</Subheadline>}
        <Caption style={{ color: unactiveProfile ? '#000000' : theme.text_color }}>
          {unactiveProfile 
            ? t('workspace.sub.expired', { context: 'description' })
            : renderSubscriptionDate()
          }
        </Caption>
      </div>
      
      <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        {!unactiveProfile && <Caption>{t('button.edit')}</Caption>}
        <ChevronRight style={{ color: unactiveProfile ? '#000000' : theme.text_color }} size={20}/>
      </div>
    </div>
  );
};

export default SubscriptionBanner;