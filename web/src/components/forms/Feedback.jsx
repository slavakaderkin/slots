import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, Section, Text, Cell, Switch, Rating } from '@telegram-apps/telegram-ui';

import useTelegram from '@hooks/useTelegram';
import InputWraper from '@components/forms/helpers/InputWraper';

export default ({ control, register, errors, handleFocus, handleBlur, watch, setValue, trigger }) => {
  const { t } = useTranslation();
  const { themeParams: theme } = useTelegram().WebApp;

  console.log(watch());
  
  const genInputProps = (name) => {
    return {
      ...register(name),
      placeholder: t(`form.feedback.placeholder.${name}`),
      onFocus: () => handleFocus(name),
      onBlur: () => handleBlur(name),
    };
  };

  const handleRatingChange = (value) => {
    setValue('rating', value);
    trigger();
  }

  return (
    <Form control={control} style={{ width: '100%' }}>

      <Rating style={{ background: theme.secondary_bg_color }} onChange={handleRatingChange}/>

      <Section style={{ width: '100%' }}>
        <InputWraper ent='feedback' name='text' error={errors.name?.text}>
          <Textarea
            {...genInputProps('text')}
            status={errors.text ? 'error' : 'default'} 
          />
        </InputWraper>
        <Cell 
          style={{ background: theme.secondary_bg_color }}
          description={t(`form.feedback.hint.isAnonymous`, { context: watch('isAnonymous') ? 'y' : 'n' })}
          after={
            <Switch 
              checked={watch('isAnonymous')} 
              onChange={({ target }) => setValue('isAnonymous', target.checked)}
            />
          }
          multiline
        >
          <Text>{t('form.feedback.field.isAnonymous')}</Text>
        </Cell>
      </Section>
    </Form>
  );

};