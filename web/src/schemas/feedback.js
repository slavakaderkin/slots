import * as Yup from 'yup';
import i18n from '../i18n';

export default Yup.object().shape({  
  rating: Yup.number().required(),
  text: Yup.string().max(150)
});