import { Caption } from '@telegram-apps/telegram-ui';
import { Star } from 'react-feather';
import { useTranslation } from 'react-i18next';
import useTelegram from '@hooks/useTelegram';

export default ({ count, onClick }) => {
  const { t } = useTranslation();
  const { themeParams: theme } = useTelegram().WebApp;

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '4px', 
        alignItems: 'center',
        background: count ? '#eb8218' : 'none',
        width: 'fit-content',
        borderRadius: '10px',
        padding: '4px 6px',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #eb8218' 
      }}
      onClick={onClick}
    >
      <Caption style={{ color: count ? '#ffffff' : theme.text_color }}>
        {t('profile.feedbacks', { count: count || 0 })}
      </Caption>
    </div>
  );
};