import { useTranslation } from 'react-i18next';
import { Subheadline, Section, Cell, Title , Navigation} from '@telegram-apps/telegram-ui';
import { ChevronRight } from 'react-feather';
import { Player } from '@lottiefiles/react-lottie-player';
import json from '../../assets/animation/referal.json'

import useTelegram from '@hooks/useTelegram';

const ReferalProgram = () => {
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { themeParams: theme, HapticFeedback, openTelegramLink } = WebApp;

  const handleClick = () => {
    HapticFeedback.impactOccurred('soft');
    openTelegramLink('https://t.me/PickQuickBot?profile');
  };

  return (
    <Section style={{ width: '100%' }}>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={
          <Player
            src={json}
            loop
            autoplay
            style={{ width: 48, height: 48 }}
          />
        }
        multiline
        description={t('subscription.referal.description')}
      >
        {t('subscription.referal.title')}
      </Cell>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={<Title>1</Title>}
        after={<Navigation></Navigation>}
        onClick={handleClick}
      >
         {t('subscription.referal.one')}
      </Cell>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={<Title>2</Title>}
      >
         {t('subscription.referal.two')}
      </Cell>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={<Title>3</Title>}
      >
         {t('subscription.referal.three')}
      </Cell>
      <Cell
        style={{ background: theme.secondary_bg_color }}
        before={<Title>4</Title>}
      >
         {t('subscription.referal.four')}
      </Cell>
    </Section>
  );
};

export default ReferalProgram;