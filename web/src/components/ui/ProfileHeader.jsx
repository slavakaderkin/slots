import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Section, Cell, Text, Avatar, InlineButtons, Caption, Skeleton, IconButton } from '@telegram-apps/telegram-ui';
import { Clock, Calendar, Pocket, Users, Settings, Copy, Send, User } from 'react-feather';

import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import useMetacom from '@hooks/useMetacom';

import RatingBadge from '@components/ui/RatingBadge';
import Scrollable from '@components/layout/Scrollable';

const ProfileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account: { profile, accountId } } = useAuth();
  const { api } = useMetacom();
  const { t } = useTranslation();
  const { WebApp } = useTelegram();
  const { account } = useAuth();
  const { themeParams: theme, HapticFeedback, showAlert } = WebApp;
  
  const currentPath = location.pathname.split('/')[1];

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const getButtonMode = (path) => {
    const targetPath = path.replace('/', '');
    return currentPath === targetPath ? 'bezeled' : 'gray';
  };

  const [isProfileSended, setIsProfileSended] = useState(false);
  const handleSendProfile = useCallback(async () => {
    HapticFeedback.impactOccurred('light');
    const args = { accountId, profileId: profile.profileId }
    const ok = await api.profile.sendToChat(args);
    if (ok) {
      setIsProfileSended(true);
      showAlert(t('popup.alert.profile.sended'));
    }
  }, [profile, accountId]);

  const copyLink = useCallback(() => {
    HapticFeedback.impactOccurred('soft');
    const link = `https://t.me/PickQuickBot/profile?startapp=profile_${profile?.profileId}`
    navigator.clipboard.writeText(link)
      .then(() => {
        showAlert(t('popup.alert.profile.copied'));
      })
      .catch(() => {});
  }, [profile]);

  const renderButtons = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconButton size='s' onClick={copyLink}><Copy /></IconButton>
        <IconButton size='s' disabled={isProfileSended} onClick={handleSendProfile}><Send /></IconButton>
        {/*<IconButton size='s' onClick={go(`/preview/${profile.profileId}`)}><User /></IconButton>}*/}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <Section style={{ width: '100%', marginBottom: '12px' }}>
      <Cell
        style={{ background: theme.secondary_bg_color, padding: '8px 12px' }}
        subhead={<RatingBadge rating={profile?.rating}/>}
        //subtitle={renderSubscriptionDate()}
        before={<Skeleton><Avatar onClick={go(`/preview/${profile.profileId}`)} src={profile.photo} size={48}></Avatar></Skeleton>}
        after={renderButtons()}
      >
        <Text onClick={go(`/preview/${profile.profileId}`)}>{profile.name}</Text>
      </Cell>
      
      <div style={{ width: '100%', background: theme.secondary_bg_color }}>
        <Scrollable>
          <Skeleton>
            <InlineButtons style={{ padding: '8px' }}>
              <InlineButtons.Item 
                mode={getButtonMode('/workspace')} 
                text={t('workspace.menu.workspace')}
                onClick={go('/workspace')}
              >
                <Clock />
              </InlineButtons.Item>
              <InlineButtons.Item 
                mode={getButtonMode('/slots')} 
                onClick={go('/slots')} 
                text={t('workspace.menu.slots')}
              >
                <Calendar />
              </InlineButtons.Item>
              <InlineButtons.Item 
                mode={getButtonMode('/services')} 
                onClick={go('/services')} 
                text={t('workspace.menu.services')}
              >
                <Pocket />
              </InlineButtons.Item>
              <InlineButtons.Item 
                mode={getButtonMode('/clients')} 
                onClick={go('/clients')} 
                text={t('workspace.menu.clients')}
              >
                <Users />
              </InlineButtons.Item>
              <InlineButtons.Item 
                mode={getButtonMode('/settings')} 
                onClick={go('/settings')} 
                text={t('workspace.menu.settings')}
              >
                <Settings />
              </InlineButtons.Item>
            </InlineButtons>
          </Skeleton>
          
        </Scrollable>
      </div>
    </Section>
  );
};

export default ProfileHeader;