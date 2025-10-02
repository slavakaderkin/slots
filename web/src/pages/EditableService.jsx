import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Text, Caption, TabsList } from '@telegram-apps/telegram-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import useAuth from '@hooks/useAuth';
import useTelegram from '@hooks/useTelegram';
import useMetacom from '@hooks/useMetacom';
import MainButton from '@components/ui/MainButton';
import Menu from '@components/ui/Menu'
import Space from '@components/layout/Space';
import useFocusManager from '@hooks/useFocusManager';
import Form from '@components/forms/Service';
import Info from '@pages/Info';
import schema from '@schemas/service';
import useApiCall from '@hooks/useApiCall';
import useBackButton from '@hooks/useBackButton';

export default () => {
  const { serviceId } = useParams();
  const { account } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const metacom = useMetacom();
  const { HapticFeedback, themeParams: theme, showAlert } = WebApp;

  const { call: loadService, data: serviceData = {}, loading: serviceLoading } = 
    useApiCall('service.byId', { 
      params: { serviceId },
      autoFetch: false
    });

  const { data: profileData, loading: profileLoading } = 
    useApiCall('profile.my', { 
      autoFetch: true
    });

  const [updating, setUpdating] = useState(false);

  useBackButton();

  useEffect(() => {
    if (serviceId) loadService();
  }, [serviceId, loadService]);

  const defaultValues = {
    profileId: profileData?.profileId || '',
    name: '',
    description: '',
    price: 0,
    duration: profileData?.slotDuration || 60,
    isVisits: false,
    isOnline: false,
    autoConfirm: true,
    allDay: false,
  };

  const formMethods = useForm({ 
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const { formState: { errors, isDirty }, trigger, handleSubmit, reset } = formMethods;
  const { isFocus, handleFocus, handleBlur } = useFocusManager();

  useEffect(() => void trigger(), [trigger]);

  // Сбрасываем форму когда приходят данные
  useEffect(() => {
    if (serviceData || profileData) {
      const formData = {
        ...defaultValues,
        ...serviceData,
        profileId: profileData?.profileId,
        duration: profileData?.slotDuration || defaultValues.duration,
      };
      
      reset(formData);
      trigger();
    }
  }, [serviceData, profileData, reset]);

  const handleSave = useCallback(async (formData) => {
    HapticFeedback.impactOccurred('soft');
    setUpdating(true);
    
    try {
      await metacom.api.service.save(formData);
     
      showAlert(t('popup.alert.service.save.success'));
      navigate('/settings/services');
    } catch (error) {
      console.error('Save error:', error);
      showAlert(t('popup.alert.service.save.failed'));
    } finally {
      setUpdating(false);
    }
  }, [loadService]);

  const formProps = {
    ...formMethods,
    errors,
    handleFocus,
    handleBlur
  };

  // Показываем загрузку если данные еще грузятся
  if ((serviceId && serviceLoading) || profileLoading) return <Info type='loading'/>

  return (
    <>
      {isIos && <Space />}
    
      <Form {...formProps}/>

      <Space gap={isFocus ? '50px' : '200px'}/>
      
      {!isFocus && (
        <Menu>
          <MainButton
            loading={updating} 
            disabled={!isDirty || Object.keys(errors).length > 0}
            text={t('button.save')}
            handler={handleSubmit(handleSave)}
            wrapped={true}
          />
        </Menu>
      )}
    </>
  );
};