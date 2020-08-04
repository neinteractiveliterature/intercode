import deserializeUserConProfile, { ParsedUserConProfile } from './deserializeUserConProfile';
import { UserConProfile } from '../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

function buildStateFromData<
UserConProfileType extends Pick<UserConProfile, 'form_response_attrs_json'>,
ConventionType extends { user_con_profile_form: CommonFormFieldsFragment },
>(userConProfileData: UserConProfileType, conventionData: ConventionType): {
  userConProfile: ParsedUserConProfile<UserConProfileType>,
  convention: ConventionType,
  form: CommonFormFieldsFragment,
} {
  return {
    userConProfile: deserializeUserConProfile(userConProfileData),
    convention: conventionData,
    form: conventionData.user_con_profile_form,
  };
}

export default buildStateFromData;
