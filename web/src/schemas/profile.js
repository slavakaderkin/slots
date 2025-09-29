import * as Yup from 'yup';
import i18n from '../i18n';

export default Yup.object().shape({  
  name: Yup.string()
    .required(i18n.t('form.profile.error.name'))
    .min(5, i18n.t('form.profile.error.name'))
    .max(35, i18n.t('form.profile.error.name')),

  description: Yup.string()
    .required(i18n.t('form.profile.error.description'))
    .min(10, i18n.t('form.profile.error.description'))
    .max(550, i18n.t('form.profile.error.description')),

  category: Yup.string()
    .required(i18n.t('form.profile.error.category')),

});