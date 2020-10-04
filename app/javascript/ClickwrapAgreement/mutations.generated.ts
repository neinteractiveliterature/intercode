/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AcceptClickwrapAgreementMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type AcceptClickwrapAgreementMutation = (
  { __typename: 'Mutation' }
  & { acceptClickwrapAgreement?: Types.Maybe<(
    { __typename: 'AcceptClickwrapAgreementPayload' }
    & { my_profile: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id' | 'accepted_clickwrap_agreement'>
    ) }
  )> }
);


export const AcceptClickwrapAgreementDocument = gql`
    mutation AcceptClickwrapAgreement {
  acceptClickwrapAgreement(input: {}) {
    my_profile {
      id
      accepted_clickwrap_agreement
    }
  }
}
    `;
export type AcceptClickwrapAgreementMutationFn = Apollo.MutationFunction<AcceptClickwrapAgreementMutation, AcceptClickwrapAgreementMutationVariables>;

/**
 * __useAcceptClickwrapAgreementMutation__
 *
 * To run a mutation, you first call `useAcceptClickwrapAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptClickwrapAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptClickwrapAgreementMutation, { data, loading, error }] = useAcceptClickwrapAgreementMutation({
 *   variables: {
 *   },
 * });
 */
export function useAcceptClickwrapAgreementMutation(baseOptions?: Apollo.MutationHookOptions<AcceptClickwrapAgreementMutation, AcceptClickwrapAgreementMutationVariables>) {
        return Apollo.useMutation<AcceptClickwrapAgreementMutation, AcceptClickwrapAgreementMutationVariables>(AcceptClickwrapAgreementDocument, baseOptions);
      }
export type AcceptClickwrapAgreementMutationHookResult = ReturnType<typeof useAcceptClickwrapAgreementMutation>;
export type AcceptClickwrapAgreementMutationResult = Apollo.MutationResult<AcceptClickwrapAgreementMutation>;
export type AcceptClickwrapAgreementMutationOptions = Apollo.BaseMutationOptions<AcceptClickwrapAgreementMutation, AcceptClickwrapAgreementMutationVariables>;