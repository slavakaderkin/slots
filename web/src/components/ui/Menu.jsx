import { useTranslation } from "react-i18next";
import { FixedLayout, Tabbar } from '@telegram-apps/telegram-ui';
import { useNavigate, useLocation } from 'react-router';
import useTelegram from '@hooks/useTelegram';
import useAuth from '@hooks/useAuth';
import {
  AtSign as AccountIcon,
  List as BookingsIcon,
  Users as ClientsIcon,
  Settings as SettingsIcon,
  Shield as ProfileIcon,
  BarChart as StatsIcon,
} from 'react-feather';

export const useNavigation = () => {
  const { WebApp } = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();
  
  const go = (path) => () => {
    WebApp.HapticFeedback.impactOccurred('soft');
    navigate(path);
  };
  
  const currentPath = location.pathname.split('/')[1];
  const isHome = location.pathname === '/';
  
  return { go, currentPath, isHome };
};

// Конфигурация меню для пользователя
const USER_MENU = [
  { id: 'account', icon: AccountIcon },
  { id: 'bookings', icon: BookingsIcon },
  //{ id: 'profiles', icon: BookingsIcon },
];

// Конфигурация меню для админа
const PROFILE_MENU = [
  { id: 'account', icon: AccountIcon },
  { id: 'workspace', icon: ProfileIcon },
  { id: 'clients', icon: ClientsIcon },
  //{ id: 'stats', icon: StatsIcon },
  { id: 'settings', icon: SettingsIcon },
];

export default ({ children }) => {
  const { account } = useAuth();
  const { unactiveProfile } = account;
  const { themeParams: theme, platform } = useTelegram().WebApp;
  const { t } = useTranslation();
  const { go, currentPath, isHome } = useNavigation();
  const isIos = platform === 'ios';

  const style = {
    padding: `8px 10px ${isIos ? '22px' : '8px'} 10px`,
    background: theme.bottom_bar_bg_color
  };
  
  const menuItems = PROFILE_MENU // по усовию потом : USER_MENU;
  
  const wrapperStyle = { 
    background: theme.bottom_bar_bg_color || '#000',
    padding: children && '12px 12px 94px 12px'
  };

  return (
    <FixedLayout style={wrapperStyle}>
      {children}
      <Tabbar style={style}>
        {menuItems.map(({ id, icon: Icon }) => {
          const selected = id === currentPath || (isHome && id === 'account');
          const text = t(`common.menu.${id}`);
          const path = id === 'account' ? '/' : `/${id}`;
          //const disabled = ['clients', 'stats'].includes(id) && unactiveProfile;
          return (
            <Tabbar.Item
              key={id} 
              selected={selected}
              text={text}
              onClick={go(path)}
              //disabled={disabled}
            >
              <Icon />
            </Tabbar.Item>
          );
        })}
      </Tabbar>
    </FixedLayout>
  );
};