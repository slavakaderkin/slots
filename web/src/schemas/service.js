import * as Yup from 'yup';
import i18n from '../i18n';

export default Yup.object().shape({  
  name: Yup.string()
    .required(i18n.t('form.service.error.name'))
    .min(5, i18n.t('form.service.error.name'))
    .max(35, i18n.t('form.service.error.name')),

  description: Yup.string()
    .max(550, i18n.t('form.service.error.description')),

  price: Yup.string()
    .required(i18n.t('form.service.error.price'))
    .max(7, i18n.t('form.service.error.price')),

  allDay: Yup.boolean(),

  duration: Yup.number()
    .when('allDay', ([allDay], schema) => {
      if (!allDay) {
        return schema
          .required(i18n.t('form.service.error.duration'))
          .max(1200, i18n.t('form.service.error.duration'))
      }
      else return schema.nullable();
    }),

});