import { createContext, useState, useEffect } from 'react';
import useMetacom from '@hooks/useMetacom';
import useTelegram from '@hooks/useTelegram';
import Info from '@pages/Info';

import { getClientTimezone } from '@helpers/time';

export const context = createContext(null);

export default ({ children }) => {
  const metacom = useMetacom();
  const [authData, setAuthData] = useState({ account: null, token: '' });
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState('');
  const { initData, HapticFeedback, initDataUnsafe , showAlert } = useTelegram().WebApp;
  const { user, start_param } = initDataUnsafe;
  const timezone = getClientTimezone();
  
  const resetRef = () => {
    setRef('');
  };

  const init = async () => {
    const result = await metacom.api.auth.twa({ initData, timezone });
    setAuthData(result);
    setLoading(false);
    setRef(start_param);
  };

  useEffect(() => void init(), [initData]);

  if (loading || !authData.account) return <Info type="loading" />

  return (
    <context.Provider value={{ ...authData, user, ref, resetRef, init }}>
      {children}
    </context.Provider>
  );
};