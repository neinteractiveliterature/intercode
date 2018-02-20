import deserializeUserConProfile from './deserializeUserConProfile';
import Form from '../Models/Form';

const buildStateFromData = (userConProfileData, conventionData) => {
  const {
    user_con_profile_form: userConProfileForm,
    ...conventionProps
  } = conventionData;

  return {
    userConProfile: deserializeUserConProfile(userConProfileData),
    convention: conventionProps,
    form: Form.fromApiResponse(JSON.parse(userConProfileForm.form_api_json)),
  };
};

export default buildStateFromData;
