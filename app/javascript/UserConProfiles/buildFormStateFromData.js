import deserializeUserConProfile from './deserializeUserConProfile';
import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

const buildStateFromData = (userConProfileData, conventionData) => {
  const {
    user_con_profile_form: userConProfileForm,
    ...conventionProps
  } = conventionData;

  return {
    userConProfile: deserializeUserConProfile(userConProfileData),
    convention: conventionProps,
    form: deserializeForm(userConProfileForm),
  };
};

export default buildStateFromData;
