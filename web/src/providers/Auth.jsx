// AuthProvider.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
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
  const { initData, initDataUnsafe } = useTelegram().WebApp;
  const { user, start_param } = initDataUnsafe;
  const timezone = getClientTimezone();
  
  const resetRef = () => {
    setRef('');
  };

  const init = useCallback(async () => {
    setRef(start_param);
    const result = await metacom.api.auth.twa({ initData, timezone });
    setAuthData(result);
    setLoading(false);
    return result;
  }, [initData, timezone, start_param]);

  useEffect(() => {
    init();
  }, [init]);

  if (loading || !authData.account) return <Info type="loading" />

  return (
    <context.Provider value={{ 
      ...authData, 
      user, 
      ref, 
      resetRef, 
      init,
      account: authData.account,
      token: authData.token 
    }}>
      {children}
    </context.Provider>
  );
};