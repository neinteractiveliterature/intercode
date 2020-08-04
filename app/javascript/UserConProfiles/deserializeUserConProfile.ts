import { UserConProfile } from '../graphqlTypes.generated';

export type ParsedUserConProfile<T extends Pick<UserConProfile, 'form_response_attrs_json'>> = (
  Omit<T, 'form_response_attrs_json'> & {
    form_response_attrs: {
      [x: string]: any,
    }
  }
);

export default function deserializeUserConProfile<T extends Pick<UserConProfile, 'form_response_attrs_json'>>(
  userConProfile: T,
): ParsedUserConProfile<T> {
  const { form_response_attrs_json: formResponseAttrsJSON, ...otherAttrs } = userConProfile;

  return {
    form_response_attrs: JSON.parse(formResponseAttrsJSON ?? '{}'),
    ...otherAttrs,
  };
}
