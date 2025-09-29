import { useEffect } from 'react';

import useTelegram from '@hooks/useTelegram';
import { useNavigate } from 'react-router';

export default (path) => {
  const { BackButton, HapticFeedback } = useTelegram().WebApp;
  const navigate = useNavigate();
  const back = () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path || -1, { replace: true });
  };

  useEffect(() => {
    BackButton.onClick(back).show();
    return () => BackButton.offClick(back).hide();
  }, []);

  return null;
};
