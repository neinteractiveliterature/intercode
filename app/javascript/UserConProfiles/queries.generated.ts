/* eslint-disable */
import * as Types from '../graphqlTypes.generated';



export type UserConProfileFieldsFragment = (
  { __typename?: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id' | 'name' | 'privileges' | 'form_response_attrs_json' | 'gravatar_enabled' | 'gravatar_url'>
);

export const UserConProfileFieldsFragmentDoc = gql`
    fragment UserConProfileFields on UserConProfile {
  id
  name
  privileges
  form_response_attrs_json
  gravatar_enabled
  gravatar_url
}
    `;