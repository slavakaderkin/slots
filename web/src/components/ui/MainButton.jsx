import { useEffect } from 'react';
import useTelegram from '@hooks/useTelegram';
import { Button, FixedLayout } from '@telegram-apps/telegram-ui';

// скорее всего эта ебала лишняя
// ну или хотябы эффект переделать, ща не нравится
export default ({ handler, text, loading, disabled, wrapped = false, children , second }) => {
  const { WebApp, isSupport } = useTelegram();
  const { MainButton, themeParams: theme } = WebApp;
  /*
  useEffect(() => {
    if (!isSupport) return;
    const reset = () => {
      MainButton.offClick(handler).disable().hide()
    }
    const params = {
      color: disabled ? theme.section_bg_color : theme.button_color,
      text_color: disabled ? theme.hint_color : theme.text_color,
      is_active: !disabled,
      is_enable: !disabled,
      text,
    }
    MainButton.setParams(params).onClick(handler);
    if (!visible) reset();
    else MainButton.enable().show();
    if (loading) MainButton.showProgress();
    else MainButton.hideProgress();
   
    return reset;
  }, [handler, loading, visible, text, disabled]);
 */
  const renderButton = () => (
    <Button
      loading={loading}
      stretched={true}
      mode='filled'
      size='l'
      disabled={disabled}
      onClick={handler}
    >
      {text}
    </Button>
  );

  return (
    <>
      {wrapped && renderButton()}
      {!wrapped &&
        <FixedLayout 
          style={{ 
            background: theme.bottom_bar_bg_color, 
            padding: '12px 12px 20px 12px',
            zIndex: 9999
          }}
        >
          {children}
          {renderButton()}
        </FixedLayout>
      }
    </>
  )
  
}