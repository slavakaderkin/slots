import { useEffect } from 'react';

import useTelegram from '@hooks/useTelegram';
import { useNavigate, useLocation } from 'react-router';

export default (path) => {
  const { BackButton, HapticFeedback } = useTelegram().WebApp;
  const navigate = useNavigate();
  const location = useLocation()

  const back = () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path || -1, { replace: true });
  };

  useEffect(() => {
    if (location.key === 'default') return;
    BackButton.onClick(back).show();
    return () => BackButton.offClick(back).hide();
  }, []);

  return null;
};
