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

  const { data: profile, loading: profileLoading } = 
    useApiCall('profile.my', { 
      autoFetch: true
    });
  
  const { call: getServices, data: services, loading: servicesLoading } =
    useApiCall('service.byProfile', { 
      autoFetch: false
    });

  useEffect(() => {
    if (profile) getServices({ profileId: profile.profileId });
  }, [profile])

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const renderTabs = () => (
    <div style={{ 
      top: 0, 
      width: '100%', 
      background: theme.bottom_bar_bg_color, 
      position: 'fixed', 
      zIndex: 999 
    }}>
      {isIos && <Space gap='90px'/>}
      <TabsList style={{ maxHeight: '40px' }}>
        <TabsList.Item onClick={go('/settings')}>{t('settings.tabs.profile')}</TabsList.Item>
        <TabsList.Item selected>
          {t('settings.tabs.services')}
        </TabsList.Item>
      </TabsList>
    </div>
  );

  //if (servicesLoading || profileLoading) return <InfoPage type='loading'/>

  return (
    <>
      {renderTabs()}

      {!services?.length && <InfoPage 
        type='empty'
        header={ t('services.empty')} 
        text={t('services.empty', { context: 'description' })}
      />}

      {!!services?.length && <>
        <Space gap={isIos ? '130px' : '50px'}/>
        {services.map((service) => {
          const isOwner = service.profileId === profile.profileId;
          return <ServiceCard refetchServices={() => getServices({ profileId: profile.profileId })} key={service.serviceId} service={service} isOwner={isOwner}/>
        })}
        <Space gap='170px'/>
      </>}
      
      <Menu>
        <MainButton
          text={t('button.add')}
          handler={go('/settings/services/add')}
          wrapped={true}
        />
      </Menu>
    </>

  )
}