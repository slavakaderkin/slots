import { useTranslation } from 'react-i18next';
import { Subheadline } from '@telegram-apps/telegram-ui';
import { ChevronRight } from 'react-feather';

import useTelegram from '@hooks/useTelegram';

const PremiumBotBanner = () => {
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { themeParams: theme, HapticFeedback, openTelegramLink } = WebApp;

  const handleClick = () => {
    HapticFeedback.impactOccurred('soft');
    openTelegramLink('https://t.me/PremiumBot');
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        margin: '12px',
        border: `1px solid ${theme.link_color}`,
        cursor: 'pointer'
      }}
    > 
      <div style={{ padding: '12px' }}>
        <Subheadline>{t('promo.stars')}</Subheadline>
      </div>
      <div style={{ padding: '12px' }}>
        <ChevronRight size={20}/>
      </div>
    </div>
  );
};

export default PremiumBotBanner;