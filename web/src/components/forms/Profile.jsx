import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Section, Selectable, Cell, Modal, Switch, Text } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import InputWraper from '@components/forms/helpers/InputWraper';

export default ({ control, register, errors, handleFocus, handleBlur, setValue, watch, trigger }) => {
  const { t, i18n } = useTranslation();
  const { themeParams: theme } = useTelegram().WebApp;
  const categories = i18n.getResource(i18n.language,  'translation', 'categories');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genInputProps = (name) => {
    return {
      ...register(name),
      placeholder: t(`form.profile.placeholder.${name}`),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
    };
  };

  const handleCategorySelect = useCallback((categoryKey) => {
    setValue('category', categoryKey);
    trigger();
    setIsModalOpen(false);
  }, [setValue]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
              onClick={openModal}
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

          <Cell 
            style={{ background: theme.secondary_bg_color }}
            description={t(`form.profile.hint.autoConfirm`, { context: watch('autoConfirm') ? 'y' : 'n' })}
            after={
              <Switch 
                checked={watch('autoConfirm')} 
                onChange={({ target }) => setValue('autoConfirm', target.checked) && trigger()}
              />
            }
            multiline
          >
            <Text>{t('form.profile.field.autoConfirm')}</Text>
          </Cell>
          
          {/*<InputWraper ent='profile' name='termLink' error={errors.termLink?.message}>
            <Input
              {...genInputProps('termLink')}
              status={errors.termLink ? 'error' : 'default'} 
            />
          </InputWraper>*/}
        </Section>
      </form>

      <Modal
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
              onClick={() => handleCategorySelect(key)}
              before={<Selectable defaultChecked={key === watch('category')}/>}
            >
              {value}
            </Cell>
          ))}
        </Section>
      </Modal>

      
    </>
  );
};