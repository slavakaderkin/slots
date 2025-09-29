import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
import Form from '@components/forms/Profile';
import schema from '@schemas/profile';
import useApiCall from '@hooks/useApiCall';
import useBackButton from '@hooks/useBackButton';

const IMAGE_SIZE = 512;

export default () => {
  const { account } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { WebApp, isIos } = useTelegram();
  const metacom = useMetacom();
  const { HapticFeedback, themeParams: theme, showAlert } = WebApp;
  const { call, data: profile, loading } =
    useApiCall('profile.my', { autoFetch: true, params: { clean: true } });

  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useBackButton();

  const defaultValues = {
    accountId: account.accountId,
    isActive: true,
    name: '',
    description: '',
    specialization: '',
    slotDuration: 60,
    autoConfirm: true,
    city: '',
    address: '',
    termLink: '',
  };

  const formMethods = useForm({ 
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const { formState: { errors, isDirty }, trigger, handleSubmit, reset } = formMethods;
  const { isFocus, handleFocus, handleBlur } = useFocusManager();

  useEffect(() => void trigger(), [trigger]);

  useEffect(() => {
    if (profile) {
      const { rating, slotCount, ...rest } = profile;
      reset({
        ...defaultValues,
        ...rest,
      });
      if (profile.photo) setImageUrl(profile.photo);
    }
  }, [profile, reset]);

  const go = (path) => () => {
    HapticFeedback.impactOccurred('soft');
    navigate(path);
  };

  const upload = useCallback(async (file, name, path) => {
    if (!file) return;
    const uploader = await metacom.createBlobUploader(file);
    await metacom.api.files.upload({ streamId: uploader.id, name, path });
    await uploader.upload();
  }, []);

  const handleSave = useCallback(async (data) => {
    HapticFeedback.impactOccurred('soft');
    setUpdating(true);
    
    try {
      await metacom.api.profile.save(data);
      if (imageFile) {
        const path = `profile/${account.accountId}`;
        const ext = imageFile.type.
          split('/')[1]
          .toLowerCase()
          .replace('jpeg', 'jpg');
        const name = `${Date.now()}.${ext}`;
        await upload(imageFile, name, path);
      }
      navigate(!profile ? '/settings/services' : `/preview/${profile.profileId}`);
      showAlert(t('popup.alert.profile.save.success', { context: profile ? 'toprofile' : 'toservices' }));
    } catch {
      showAlert(t('popup.alert.profile.save.failed'));
    } finally {
      setUpdating(false);
    }
  }, [imageFile, upload, profile]);

  const changeImage = async (e) => {
    const [file] = e.target.files;
    if (!file) return;
    
    resizeImage(file, IMAGE_SIZE, (blob) => {
      setImageFile(blob);
      setImageUrl(URL.createObjectURL(blob));
    });
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
        <TabsList.Item selected>{t('settings.tabs.profile')}</TabsList.Item>
        <TabsList.Item disabled={!profile} onClick={go('/settings/services')}>
          {t('settings.tabs.services')}
        </TabsList.Item>
      </TabsList>
    </div>
  );

  const formProps = {
    ...formMethods,
    errors,
    handleFocus,
    handleBlur,
  };

  return (
    <>
      <Space gap={isIos ? '140px' : '70px'}/>
      {renderTabs()}

      <div style={{ width: '100%' }}>
        <input 
          type='file' 
          id="picture" 
          onChange={changeImage} 
          style={{ display: 'none' }} 
          accept="image/*"
        />
        <label htmlFor="picture" style={imageLabelStyle}>
          <div style={imageContainerStyle(theme)}>
            {imageUrl ? (
              <img src={imageUrl} style={imageStyle} /> 
            ) : (
              <div style={placeholderStyle}>
                <Text style={{ textAlign: 'center' }}>
                  {t('form.profile.field.picture')}
                </Text>
                <Caption style={{ textAlign: 'center' }}>
                  {t('form.profile.hint.picture')}
                </Caption>
              </div>
            )}
          </div>
        </label>
      </div>
      
      <Form {...formProps}/>

      <Space gap={isFocus ? '50px' : '200px'}/>
      
      {!isFocus && (() => {
        const buttonProps = {
          loading: updating || loading,
          disabled: Object.keys(errors).length > 0,
          text: t('button.save'),
          handler: handleSubmit(handleSave)
        };

        return profile ? (
          <Menu>
            <MainButton {...buttonProps} wrapped={true} />
          </Menu>
        ) : (
          <MainButton {...buttonProps} />
        );
      })()}
    </>
  );
};


const imageLabelStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  width: '100%'
};

const imageContainerStyle = (theme) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: '10px',
  border: `1px dashed ${theme.link_color}`,
  background: theme.section_bg_color
});

const imageStyle = {
  objectFit: 'cover',
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: '10px'
};

const placeholderStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '70%'
};