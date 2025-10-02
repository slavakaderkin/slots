import * as Yup from 'yup';
import i18n from '../i18n';

export default Yup.object().shape({
  serviceId: Yup.string().required(),
  profileId: Yup.string().required(),
  slotId: Yup.string().required(),
  comment: Yup.string().max(250),



  clientId: Yup.string()
    .when('accountId', ([accountId], schema) => {
      if (!accountId) return schema.required()
      else return schema.nullable();
    }),
});