import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Section, Selectable, Cell, Modal, Switch, Text, Caption } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import useApiCall from '@hooks/useApiCall';
import useAuth from '@hooks/useAuth';
import InputWraper from '@components/forms/helpers/InputWraper';

export default ({ control, register, errors, handleFocus, handleBlur, setValue, watch, trigger }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { themeParams: theme, HapticFeedback, openLink } = useTelegram().WebApp;
  const categories = i18n.getResource(i18n.language,  'translation', 'categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const { data: countries } = useApiCall('geo.countries', { autoFetch: true });
  const { call: getCities, data: cities } = useApiCall('geo.citiesByCode', { autoFetch: false });
  console.log("🚀 ~ cities:", cities)
  
  const [country] = watch('country') ? countries.filter(({ code }) => code === watch('country')) : [];

  useEffect(() => {
    if (country) getCities({ code: country.code });
  }, [country]);

  const genInputProps = (name) => {
    return {
      ...register(name),
      placeholder: t(`form.profile.placeholder.${name}`),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
    };
  };

  const genHandleSelect = useCallback((field, value) => () => {
    HapticFeedback.selectionChanged();
    setValue(field, value, { shouldDirty: true, shouldValidate: true });
    trigger();
    setIsModalOpen(false);
  }, [setValue]);

  const openModal = useCallback((type) => () => {
    HapticFeedback.impactOccurred('soft');
    setIsModalOpen(true);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAboutMapLink = () => {
    HapticFeedback.impactOccurred('soft');
    const links = {
      ru: 'https://telegra.ph/Kak-vstavit-ssylku-na-kartu-10-01',
      en: 'https://telegra.ph/Kak-vstavit-ssylku-na-kartu-10-01',
    };
    const link = links[user.language_code] || links.en;
    openLink(link, { try_instant_view: true });
  };

  const renderMapLinkHint = () => (
    <Caption>{t('form.profile.hint.mapLink')} 
      <Caption 
        style={{ color: theme.link_color }}
        onClick={handleAboutMapLink}
      >
        {t('form.profile.hint.mapLink', { context: 'link' })}
      </Caption>
    </Caption>
  );

  return (
    <>
      <form control={control} style={{ width: '100%' }}>
        <Section style={{ width: '100%' }}>
          <InputWraper ent='profile' name='name' error={errors.name?.message}>
            <Input
              {...genInputProps('name')}
              status={errors.name ? 'error' : 'default'} 
            />
          </InputWraper>
          
          <InputWraper ent='profile' name='description' error={errors.description?.message}>
            <Textarea
              {...genInputProps('description')}
              status={errors.description ? 'error' : 'default'} 
            />
          </InputWraper>

          <InputWraper ent='profile' name='category' error={errors.category?.message}>
            <Cell
              onClick={openModal('categories')}
              style={{
                background: theme.bg_color,
                borderRadius: '10px',
                border: errors.category ? `1.5px solid ${theme.destructive_text_color}` : 'none' 
              }}
            >
              {categories[watch('category')] ?? t('form.profile.placeholder.category')}
            </Cell>
           
          </InputWraper>

          <InputWraper ent='profile' name='specialization' error={errors.specialization?.message}>
            <Input
              {...genInputProps('specialization')}
              status={errors.specialization ? 'error' : 'default'} 
            />
          </InputWraper>

          <InputWraper ent='profile' name='country' error={errors.country?.message}>
            <Cell
              onClick={openModal('countries')}
              style={{
                background: theme.bg_color,
                borderRadius: '10px',
                border: errors.country ? `1.5px solid ${theme.destructive_text_color}` : 'none' 
              }}
              before={country?.emoji}
            >
              {country ? country?.native :  t('form.profile.placeholder.country')}
            </Cell>
           
          </InputWraper>

          <InputWraper ent='profile' name='address' error={errors.address?.message}>
            <Input
              {...genInputProps('address')}
              status={errors.address ? 'error' : 'default'} 
            />
          </InputWraper>

          <InputWraper ent='profile' name='mapLink' error={errors.mapLink?.message} hint={renderMapLinkHint()}>
            <Input
              {...genInputProps('mapLink')}
              status={errors.mapLink ? 'error' : 'default'} 
            />
          </InputWraper>
          
          {/*<InputWraper ent='profile' name='termLink' error={errors.termLink?.message}>
            <Input
              {...genInputProps('termLink')}
              status={errors.termLink ? 'error' : 'default'} 
            />
          </InputWraper>*/}
        </Section>
      </form>

      {modalType === 'categories' && <Modal
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
        header={<Modal.Header>{t('form.profile.field.category')}</Modal.Header>}
        style={{
          maxHeight: '80vh',
          background: theme.secondary_bg_color,
          padding: '12px 12px 40px 12px'
        }}
      >
        <Section>
          {Object.entries(categories).map(([key, value]) => (
            <Cell
              key={key}
              style={{  background: theme.secondary_bg_color }}
              onClick={genHandleSelect('category', key)}
              after={<Selectable defaultChecked={key === watch('category')}/>}
            >
              {value}
            </Cell>
          ))}
        </Section>
      </Modal>}

      {modalType === 'countries' && <Modal
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
        header={<Modal.Header>{t('form.profile.field.country')}</Modal.Header>}
        style={{
          maxHeight: '80vh',
          background: theme.secondary_bg_color,
          padding: '12px 12px 40px 12px'
        }}
      >
        <Section>
          {countries.map((country) => (
            <Cell
              key={country.code}
              style={{  background: theme.secondary_bg_color }}
              onClick={genHandleSelect('country', country.code)}
              before={country.emoji}
              after={<Selectable defaultChecked={country.code === watch('country')}/>}
            >
              {country.native}
            </Cell>
          ))}
        </Section>
      </Modal>}

    </>
  );
};