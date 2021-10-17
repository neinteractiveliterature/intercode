/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type RevokeAuthorizedApplicationMutationVariables = Types.Exact<{
  uid: Types.Scalars['ID'];
}>;


export type RevokeAuthorizedApplicationMutationData = { __typename: 'Mutation', revokeAuthorizedApplication: { __typename: 'RevokeAuthorizedApplicationPayload', clientMutationId?: string | null | undefined } };


export const RevokeAuthorizedApplicationDocument = gql`
    mutation RevokeAuthorizedApplication($uid: ID!) {
  revokeAuthorizedApplication(input: {uid: $uid}) {
    clientMutationId
  }
}
    `;
export type RevokeAuthorizedApplicationMutationFn = Apollo.MutationFunction<RevokeAuthorizedApplicationMutationData, RevokeAuthorizedApplicationMutationVariables>;

/**
 * __useRevokeAuthorizedApplicationMutation__
 *
 * To run a mutation, you first call `useRevokeAuthorizedApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeAuthorizedApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeAuthorizedApplicationMutation, { data, loading, error }] = useRevokeAuthorizedApplicationMutation({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useRevokeAuthorizedApplicationMutation(baseOptions?: Apollo.MutationHookOptions<RevokeAuthorizedApplicationMutationData, RevokeAuthorizedApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeAuthorizedApplicationMutationData, RevokeAuthorizedApplicationMutationVariables>(RevokeAuthorizedApplicationDocument, options);
      }
export type RevokeAuthorizedApplicationMutationHookResult = ReturnType<typeof useRevokeAuthorizedApplicationMutation>;
export type RevokeAuthorizedApplicationMutationResult = Apollo.MutationResult<RevokeAuthorizedApplicationMutationData>;
export type RevokeAuthorizedApplicationMutationOptions = Apollo.BaseMutationOptions<RevokeAuthorizedApplicationMutationData, RevokeAuthorizedApplicationMutationVariables>;