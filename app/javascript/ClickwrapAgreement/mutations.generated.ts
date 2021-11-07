/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AcceptClickwrapAgreementMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type AcceptClickwrapAgreementMutationData = { __typename: 'Mutation', acceptClickwrapAgreement: { __typename: 'AcceptClickwrapAgreementPayload', my_profile: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement?: boolean | null | undefined } } };


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
export type AcceptClickwrapAgreementMutationFn = Apollo.MutationFunction<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>;

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
export function useAcceptClickwrapAgreementMutation(baseOptions?: Apollo.MutationHookOptions<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>(AcceptClickwrapAgreementDocument, options);
      }
export type AcceptClickwrapAgreementMutationHookResult = ReturnType<typeof useAcceptClickwrapAgreementMutation>;
export type AcceptClickwrapAgreementMutationResult = Apollo.MutationResult<AcceptClickwrapAgreementMutationData>;
export type AcceptClickwrapAgreementMutationOptions = Apollo.BaseMutationOptions<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>;