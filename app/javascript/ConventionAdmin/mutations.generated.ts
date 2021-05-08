/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { ConventionAdminConventionFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { ConventionAdminConventionFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UpdateConventionMutationVariables = Types.Exact<{
  input: Types.UpdateConventionInput;
}>;


export type UpdateConventionMutationData = (
  { __typename: 'Mutation' }
  & { updateConvention?: Types.Maybe<(
    { __typename: 'UpdateConventionPayload' }
    & { convention: (
      { __typename: 'Convention' }
      & Pick<Types.Convention, 'id'>
      & ConventionAdminConventionFieldsFragment
    ) }
  )> }
);

export type CreateConventionStripeAccountMutationVariables = Types.Exact<{
  baseUrl: Types.Scalars['String'];
}>;


export type CreateConventionStripeAccountMutationData = (
  { __typename: 'Mutation' }
  & { createConventionStripeAccount?: Types.Maybe<(
    { __typename: 'CreateConventionStripeAccountPayload' }
    & { stripe_account: (
      { __typename: 'StripeAccount' }
      & Pick<Types.StripeAccount, 'id' | 'account_onboarding_link'>
    ) }
  )> }
);


export const UpdateConventionDocument = gql`
    mutation UpdateConvention($input: UpdateConventionInput!) {
  updateConvention(input: $input) {
    convention {
      id
      ...ConventionAdminConventionFields
    }
  }
}
    ${ConventionAdminConventionFieldsFragmentDoc}`;
export type UpdateConventionMutationFn = Apollo.MutationFunction<UpdateConventionMutationData, UpdateConventionMutationVariables>;

/**
 * __useUpdateConventionMutation__
 *
 * To run a mutation, you first call `useUpdateConventionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConventionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConventionMutation, { data, loading, error }] = useUpdateConventionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateConventionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateConventionMutationData, UpdateConventionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateConventionMutationData, UpdateConventionMutationVariables>(UpdateConventionDocument, options);
      }
export type UpdateConventionMutationHookResult = ReturnType<typeof useUpdateConventionMutation>;
export type UpdateConventionMutationResult = Apollo.MutationResult<UpdateConventionMutationData>;
export type UpdateConventionMutationOptions = Apollo.BaseMutationOptions<UpdateConventionMutationData, UpdateConventionMutationVariables>;
export const CreateConventionStripeAccountDocument = gql`
    mutation CreateConventionStripeAccount($baseUrl: String!) {
  createConventionStripeAccount(input: {}) {
    stripe_account {
      id
      account_onboarding_link(base_url: $baseUrl)
    }
  }
}
    `;
export type CreateConventionStripeAccountMutationFn = Apollo.MutationFunction<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>;

/**
 * __useCreateConventionStripeAccountMutation__
 *
 * To run a mutation, you first call `useCreateConventionStripeAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConventionStripeAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConventionStripeAccountMutation, { data, loading, error }] = useCreateConventionStripeAccountMutation({
 *   variables: {
 *      baseUrl: // value for 'baseUrl'
 *   },
 * });
 */
export function useCreateConventionStripeAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>(CreateConventionStripeAccountDocument, options);
      }
export type CreateConventionStripeAccountMutationHookResult = ReturnType<typeof useCreateConventionStripeAccountMutation>;
export type CreateConventionStripeAccountMutationResult = Apollo.MutationResult<CreateConventionStripeAccountMutationData>;
export type CreateConventionStripeAccountMutationOptions = Apollo.BaseMutationOptions<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>;