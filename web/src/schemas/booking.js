import * as Yup from 'yup';
import i18n from '../i18n';

export default Yup.object().shape({  
  accountId: Yup.string().required(),
  serviceId: Yup.string().required(),
  profileId: Yup.string().required(),
  slotId: Yup.string().required(),
  comment: Yup.string().max(250)
});