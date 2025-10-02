import { Caption } from '@telegram-apps/telegram-ui';
import { Star } from 'react-feather';
import { useTranslation } from 'react-i18next';
import useTelegram from '@hooks/useTelegram';

const RatingBadge = ({ rating, onClick }) => {
  const { t } = useTranslation();
  const { themeParams: theme } = useTelegram().WebApp;

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '4px', 
        alignItems: 'center',
        background: rating ? '#eb8218' : 'none',
        width: 'fit-content',
        borderRadius: '10px',
        padding: '4px 6px',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #eb8218' 
      }}
      onClick={onClick}
    >
      <Star style={{ color: rating ? '#ffffff' : theme.text_color }} size={12}/>
      <Caption style={{ color: rating ? '#ffffff' : theme.text_color }}>
        {t('profile.rating', { context: rating ? 'count' : 'none', rating })}
      </Caption>
    </div>
  );
};

export default RatingBadge;