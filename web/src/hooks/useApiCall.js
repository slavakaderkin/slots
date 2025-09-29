import { useState, useEffect, useCallback } from 'react';
import useAuth from './useAuth';
import useMetacom from './useMetacom';
import { useTranslation } from 'react-i18next';

export default (apiPath, options = {}) => {
  const { params = {}, autoFetch = false } = options; 
  const { api } = useMetacom();
  const { t } = useTranslation();
  const { account, token } = useAuth();
  const { accountId } = account;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const call = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalParams = {
        token,
        accountId,
        ...params,
        ...customParams
      };
      const [unit, method] = apiPath.split('.');
      const result = await api[unit][method](finalParams);

      setData(result);
      return result;
    } catch (err) {
      setError(t('common.error', { context: String(err.code) }));
    } finally {
      setLoading(false);
    }
  }, [api, apiPath, token, JSON.stringify(params)]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      call();
    }
  }, [call, options.autoFetch]);

  return {
    data,
    loading,
    error,
    call,
    setData
  };
};
