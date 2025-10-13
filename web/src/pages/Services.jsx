import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Caption } from '@telegram-apps/telegram-ui';

import useApiCall from '@hooks/useApiCall';
import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';

import MainButton from '@components/ui/MainButton';
import ProfileHeader from '@components/ui/ProfileHeader';
import SubscriptionBanner from '@components/ui/SubscriptionBanner';
import Space from '@components/layout/Space';


import InfoPage from '@pages/Info';
import ServiceCard from '@components/ui/ServiceCard';

export default () => {
  const navigate = useNavigate();
  const { account: { profile } } = useAuth();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const { HapticFeedback, themeParams: theme } = WebApp;
  
  const { call: getServices, data: services, loading: servicesLoading } =
    useApiCall('service.byProfile', { 
      autoFetch: false
    });

  useEffect(() => {
    if (profile) getServices({ profileId: profile.profileId, isOwner: true });
  }, [profile])

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const refreshServices = () => getServices({ profileId: profile.profileId, isOwner: true });

  return (
    <>
      {isIos && <Space />}
      <SubscriptionBanner />
      <ProfileHeader />

      {services?.length === 0 && 
        <> 
          <InfoPage 
            type='empty'
            header={ t('services.empty')} 
            text={t('services.empty', { context: 'description' })}
          />
          <Space gap='120px'/>
        </>
     }

      {services?.length > 0 && (
        <>
          {services.map((service) => {
            const isOwner = service.profileId === profile.profileId;
            return (
              <ServiceCard 
                profile={profile}
                key={service.serviceId}
                service={service} 
                isOwner={isOwner}
                refetchServices={refreshServices}/>
            )
          })}
          <Space gap='120px'/>
        </>
      )}
 
      <MainButton
        text={t('button.add', { context: 'service' })}
        handler={go('/services/add')}
      />
    </>

  )
}