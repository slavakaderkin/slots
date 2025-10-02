import { useTranslation } from "react-i18next";
import { Caption } from "@telegram-apps/telegram-ui";
import useTelegram from '@hooks/useTelegram';

const InputWraper = ({ children, ent, name , error, hint }) => {
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { themeParams: theme } = WebApp;

  return (
    <div style={{ dispaly: 'flex', flexDirection: 'collumn', padding: '8px' , background: theme.secondary_bg_color }}>
      <div style={{ padding: ' 0 8px 4px 8px' }}>
        <Caption>{t(`form.${ent}.field.${name}`)}</Caption>
      </div>
      {children}
      {error &&
        <div style={{ padding: ' 4px 8px 0 8px' }}>
          <Caption style={{ color: theme.destructive_text_color }}>{error}</Caption>
        </div>
      }
      {t(`form.${ent}.hint.${name}`) && 
        <div style={{ padding: '4px 8px 4px 8px' }}> 
          <Caption style={{ color: theme.hint_color }}>{hint || t(`form.${ent}.hint.${name}`)}</Caption>
        </div>
      }
    </div>
  )
};

export default InputWraper