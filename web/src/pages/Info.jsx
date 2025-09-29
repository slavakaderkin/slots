import { Placeholder } from "@telegram-apps/telegram-ui";
import { Player } from '@lottiefiles/react-lottie-player';
import { useTranslation } from 'react-i18next';
import Page from '@components/layout/Page';

import loading from '../assets/animation/loading.json';
import error from '../assets/animation/error.json';
import empty from '../assets/animation/empty.json';

export default ({ header, type, button, text = '' }) => {
  const { t } = useTranslation();
  const animation = {
    loading,
    error,
    empty,
  };


  return (
    <Page align='center'>
      <Placeholder
        header={header || t(`common.info.title`, { context: type })}
        description={text}
        action={button}
      >
        <Player
          src={animation[type]}
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </Placeholder>
    </Page>
    
  )
}