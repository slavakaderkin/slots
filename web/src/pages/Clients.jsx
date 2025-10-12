import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import useApiCall from '@hooks/useApiCall';
import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';

import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';
import ProfileHeader from '@components/ui/ProfileHeader';
import SubscriptionBanner from '@components/ui/SubscriptionBanner';

import InfoPage from '@pages/Info';
import ClientCard from '@components/ui/ClientCard';

export default () => {
  const navigate = useNavigate();
  const { account: { profile } } = useAuth();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;

  const { call: getClients, data: clients, loading: clientsLoading } =
    useApiCall('client.byProfile', { 
      autoFetch: false
    });

  useEffect(() => {
    if (profile) getClients({ profileId: profile.profileId });
  }, [profile]);


  return (
    <>
      {isIos && <Space />}
      <SubscriptionBanner />
      <ProfileHeader />
      
      {clients?.length === 0 && 
        <>
          <InfoPage 
            type='empty'
            header={ t('clients.empty')} 
            text={t('clients.empty', { context: 'description' })}
          />
          <Space gap='120px'/>
        </>
}

      {clients?.length > 0 && <>
        {clients.map((client) => {
          return <ClientCard key={client.clientId} client={client}/>
        })}
        <Space gap='120px'/>
      </>}
      
    </>

  )
}