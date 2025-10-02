import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import useApiCall from '@hooks/useApiCall';
import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';

import Space from '@components/layout/Space';
import Menu from '@components/ui/Menu';

import InfoPage from '@pages/Info';
import ClientCard from '@components/ui/ClientCard';

export default () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;

  const { data: profile, loading: profileLoading } = 
    useApiCall('profile.my', { 
      autoFetch: true
    });
  
  const { call: getClients, data: clients, loading: clientsLoading } =
    useApiCall('client.byProfile', { 
      autoFetch: false
    });

  useEffect(() => {
    if (profile) getClients({ profileId: profile.profileId });
  }, [profile]);

  if (profileLoading || clientsLoading) return <InfoPage type='loading'/>;

  return (
    <>

      {!clients?.length && !clientsLoading && <InfoPage 
        type='empty'
        header={ t('clients.empty')} 
        text={t('clients.empty', { context: 'description' })}
      />}

      {!!clients?.length && <>
        {isIos && <Space />}
        {clients.map((client) => {
          return <ClientCard key={client.clientId} client={client}/>
        })}
        <Space gap='170px'/>
      </>}
      
      <Menu />
      
    </>

  )
}