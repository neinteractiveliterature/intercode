/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { UserConProfileFieldsFragment } from './queries.generated';
import gql from 'graphql-tag';
import { UserConProfileFieldsFragmentDoc } from './queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';


export type UpdateUserConProfileMutationVariables = Types.Exact<{
  input: Types.UpdateUserConProfileInput;
}>;


export type UpdateUserConProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateUserConProfile?: Types.Maybe<(
    { __typename?: 'UpdateUserConProfilePayload' }
    & { user_con_profile: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
      & UserConProfileFieldsFragment
    ) }
  )> }
);


export const UpdateUserConProfileDocument = gql`
    mutation UpdateUserConProfile($input: UpdateUserConProfileInput!) {
  updateUserConProfile(input: $input) {
    user_con_profile {
      id
      ...UserConProfileFields
    }
  }
}
    ${UserConProfileFieldsFragmentDoc}`;
export type UpdateUserConProfileMutationFn = ApolloReactCommon.MutationFunction<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>;

/**
 * __useUpdateUserConProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserConProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserConProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserConProfileMutation, { data, loading, error }] = useUpdateUserConProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserConProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>(UpdateUserConProfileDocument, baseOptions);
      }
export type UpdateUserConProfileMutationHookResult = ReturnType<typeof useUpdateUserConProfileMutation>;
export type UpdateUserConProfileMutationResult = ApolloReactCommon.MutationResult<UpdateUserConProfileMutation>;
export type UpdateUserConProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>;