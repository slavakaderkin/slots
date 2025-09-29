import { createContext, useEffect } from 'react';
import Info from '@pages/Info';

export const context = createContext(null);
const telegram = window.Telegram;
export const platform = telegram.WebApp.platform || 'macos';
export const appearance = telegram.WebApp.colorScheme;

export default ({ children }) => {
  const { WebApp } = telegram;
  const { version: v, platform: p, BackButton } = WebApp;
  const isSupport = WebApp.initData
  const isIos = p === 'ios';
  //if (!isSupport) return <Info type="error" place="telegram" />

  useEffect(() => {
    WebApp.expand();
    if (['ios', 'android'].includes(p) && v >= 8) {
      WebApp.requestFullscreen();
      WebApp.lockOrientation();
    }
    WebApp.disableVerticalSwipes();
    WebApp.ready();
  }, []);

  return (
    <context.Provider
      value={{...telegram, isSupport, isIos }}
    >
      {children}
    </context.Provider>
  )
};