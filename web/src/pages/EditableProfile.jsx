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
import InfoPage from '@pages/Info';

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
    country: '',
    currency: 'USD',
    city: '',
    address: '',
    mapLink: '',
    termLink: '',
  };

  const formMethods = useForm({ 
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const { formState: { errors, isDirty }, trigger, handleSubmit, reset, watch } = formMethods;
  //console.log("🚀 ~ watch:", watch())
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
      navigate(!profile ? '/services' : `/preview/${profile.profileId}`);
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

  const formProps = {
    ...formMethods,
    errors,
    handleFocus,
    handleBlur,
  };

  const buttonProps = {
    loading: updating || loading,
    disabled: Object.keys(errors).length > 0 || !imageUrl,
    text: t('button.save'),
    handler: handleSubmit(handleSave)
  };

  return (
    <>
      {isIos && <Space />}

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
      
      {!isFocus && <MainButton {...buttonProps} />}
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

const imageContainerStyle = (theme, error) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: '10px',
  border: `1px ${error ? 'solid' : 'dashed'} ${error ? theme.destructive_text_color : theme.link_color}`,
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