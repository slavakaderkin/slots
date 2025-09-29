import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TabsList } from '@telegram-apps/telegram-ui';

import useApiCall from '@hooks/useApiCall';
import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';

import MainButton from '@components/ui/MainButton';
import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';

import InfoPage from '@pages/Info';
import ServiceCard from '../components/ui/ServiceCard';

export default () => {
  const { account } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;


  return (
    <>
    
    </>

  )
}