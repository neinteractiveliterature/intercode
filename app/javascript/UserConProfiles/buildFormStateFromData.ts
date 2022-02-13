import { UserConProfile } from '../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';

function buildStateFromData<
  UserConProfileType extends Pick<UserConProfile, '__typename' | 'id' | 'form_response_attrs_json'>,
  ConventionType extends { user_con_profile_form: CommonFormFieldsFragment },
>(
  userConProfileData: UserConProfileType,
  conventionData: ConventionType,
): {
  userConProfile: WithFormResponse<UserConProfileType>;
  convention: ConventionType;
  form: CommonFormFieldsFragment;
} {
  return {
    userConProfile: deserializeFormResponse(userConProfileData),
    convention: conventionData,
    form: conventionData.user_con_profile_form,
  };
}

export default buildStateFromData;
