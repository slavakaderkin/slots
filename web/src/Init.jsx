import { Suspense, useState, useEffect } from 'react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from '@routes';

import { I18nextProvider } from 'react-i18next';
import i18nInstance from './i18n';

import MetacomProvider from '@providers/Metacom';
import AuthProvider from '@providers/Auth';
import TelegramProvider, { platform, appearance } from '@providers/Telegram';

import Info from '@pages/Info';

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <Suspense fallback={<Info type="loading" />}>
      <AppRoot platform={platform} appearance={appearance}>
        <MetacomProvider>
            <TelegramProvider>
              <AuthProvider>
                <I18nextProvider i18n={i18nInstance} >
                  <RouterProvider router={router} />
                </I18nextProvider>
              </AuthProvider>
            </TelegramProvider>
        </MetacomProvider>
      </AppRoot>
    </Suspense>
    
  )
};

export default App;