import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Text, Caption, TabsList } from '@telegram-apps/telegram-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import useAuth from '@hooks/useAuth';
import useTelegram from '@hooks/useTelegram';
import useMetacom from '@hooks/useMetacom';
import resizeImage from '@helpers/resizeImage';
import MainButton from '@components/ui/MainButton';
import Menu from '@components/ui/Menu'
import Space from '@components/layout/Space';
import useFocusManager from '@hooks/useFocusManager';
import Form from '@components/forms/Feedback';
import schema from '@schemas/feedback';
import useApiCall from '@hooks/useApiCall';
import useBackButton from  '@hooks/useBackButton';
import BookingCard from '../components/ui/BookingCard';

export default () => {
  const { account } = useAuth();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const metacom = useMetacom();
  const { HapticFeedback, themeParams: theme, showAlert, close } = WebApp;
  const fromMessage = location.key === 'default';
  const [updating, setUpdating] = useState(false);

  if (!fromMessage) useBackButton();

  const { call, data: feedback, loading } = 
    useApiCall('feedback.byBooking', { autoFetch: true, params: { bookingId } });

  const { call: getBooking, data: booking } = 
    useApiCall('booking.byId', { autoFetch: true, params: { bookingId } });

  const defaultValues = {
    accountId: account.accountId,
    bookingId,
    text: '',
    isAnonymous: false,
  };

  const formMethods = useForm({ 
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const { formState: { errors, isDirty }, trigger, handleSubmit } = formMethods;
  const { isFocus, handleFocus, handleBlur } = useFocusManager();

  useEffect(() => void trigger(), [trigger]);

  const handleSave = useCallback(async (data) => {
    HapticFeedback.impactOccurred('soft');
    setUpdating(true);
    
    try {
      const ok = await metacom.api.feedback.create(data);
      if (ok) {
        showAlert(t('popup.alert.feedback.save.success'));
        if (fromMessage) close();
        else navigate(-1)
      }
      showAlert(t('popup.alert.feedback.save.failed'));
    } catch {
      showAlert(t('popup.alert.feedback.save.failed'));
    } finally {
      setUpdating(false);
    }
  }, [fromMessage]);

  const formProps = {
    ...formMethods,
    errors,
    handleFocus,
    handleBlur,
  };

  return (
    <>
      {isIos && <Space />}
     
      {!feedback && <Form {...formProps}/>}
      {booking && <BookingCard booking={booking} clickable={false}/>}

      <Space gap={isFocus ? '50px' : '200px'}/>
      
      {!isFocus && !feedback && 
        <MainButton
          loading={updating}
          disabled={Object.keys(errors).length > 0} 
          text={t('button.submit')}
          handler={handleSubmit(handleSave)}
        />}
    </>
  );
};
