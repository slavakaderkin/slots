import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Section, Text, Cell, Switch } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import InputWraper from '@components/forms/helpers/InputWraper';

export default ({ control, register, errors, handleFocus, handleBlur, watch, setValue, trigger }) => {
  const { t } = useTranslation();
  const { themeParams: theme, HapticFeedback } = useTelegram().WebApp;
  
  const genInputProps = (name) => {
    return {
      ...register(name),
      placeholder: t(`form.service.placeholder.${name}`),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
    };
  };

  const genSwitchProps = (name) => {
    const onChange = ({ target }) => {
      HapticFeedback.selectionChanged();
      setValue(name, target.checked, { shouldDirty: true, shouldValidate: true });
      trigger();
    };

    return {
      onChange,
      checked: watch(name), 
    };
  };

  return (
    <Form control={control} style={{ width: '100%' }}>
      <Section style={{ width: '100%' }}>
        <InputWraper ent='service' name='name' error={errors.name?.message}>
          <Input
            {...genInputProps('name')}
            status={errors.name ? 'error' : 'default'} 
          />
        </InputWraper>
        <InputWraper ent='service' name='description' error={errors.description?.message}>
          <Textarea
            {...genInputProps('description')}
            status={errors.description ? 'error' : 'default'} 
          />
        </InputWraper>
        <InputWraper ent='service' name='price' error={errors.price?.message}>
          <Input
            type='tel'
            {...genInputProps('price')}
            status={errors.price ? 'error' : 'default'} 
            after={<Text>{t('common.currency')}</Text>}
          />
        </InputWraper>

        {!watch('allDay') && <InputWraper ent='service' name='duration' >
          <Input
            type='tel'
            {...genInputProps('duration')}
            status={errors.duration ? 'error' : 'default'} 
            after={<Text>{t('common.minutes')}</Text>}
          />
        </InputWraper>}
        <Cell 
          style={{ background: theme.secondary_bg_color }}
          description={t(`form.service.hint.allDay`, { context: watch('allDay') ? 'y' : 'n' })}
          after={<Switch {...genSwitchProps('allDay')} />}
          multiline
        >
          <Text>{t('form.service.field.allDay')}</Text>
        </Cell>

        <Cell 
          style={{ background: theme.secondary_bg_color }}
          description={t(`form.service.hint.isOnline`, { context: watch('isOnline') ? 'y' : 'n' })}
          after={<Switch {...genSwitchProps('isOnline')} />}
          multiline
        >
          <Text>{t('form.service.field.isOnline')}</Text>
        </Cell>

        <Cell 
          style={{ background: theme.secondary_bg_color }}
          description={t(`form.service.hint.autoConfirm`, { context: watch('autoConfirm') ? 'y' : 'n' })}
          after={<Switch {...genSwitchProps('autoConfirm')} />}
          multiline
        >
          <Text>{t('form.service.field.autoConfirm')}</Text>
        </Cell>
        <Cell 
          style={{ background: theme.secondary_bg_color }}
          description={t(`form.service.hint.isVisits`, { context: watch('isVisits') ? 'y' : 'n' })}
          after={<Switch {...genSwitchProps('isVisits')} />}
          multiline
        >
          <Text>{t('form.service.field.isVisits')}</Text>
        </Cell>
      </Section>
    </Form>
  );

};