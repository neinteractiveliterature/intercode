/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { ConventionDisplayFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { ConventionDisplayFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type CreateConventionMutationVariables = Types.Exact<{
  convention: Types.ConventionInput;
  cloneConventionId?: Types.Maybe<Types.Scalars['Int']>;
  organizationId?: Types.Maybe<Types.Scalars['Int']>;
  cmsContentSetName?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateConventionMutation = (
  { __typename?: 'Mutation' }
  & { createConvention?: Types.Maybe<(
    { __typename?: 'CreateConventionPayload' }
    & { convention: (
      { __typename?: 'Convention' }
      & Pick<Types.Convention, 'id'>
      & ConventionDisplayFieldsFragment
    ) }
  )> }
);

export type SetConventionCanceledMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  canceled: Types.Scalars['Boolean'];
}>;


export type SetConventionCanceledMutation = (
  { __typename?: 'Mutation' }
  & { setConventionCanceled?: Types.Maybe<(
    { __typename?: 'SetConventionCanceledPayload' }
    & { convention: (
      { __typename?: 'Convention' }
      & Pick<Types.Convention, 'id'>
      & ConventionDisplayFieldsFragment
    ) }
  )> }
);


export const CreateConventionDocument = gql`
    mutation CreateConvention($convention: ConventionInput!, $cloneConventionId: Int, $organizationId: Int, $cmsContentSetName: String) {
  createConvention(input: {convention: $convention, clone_convention_id: $cloneConventionId, organization_id: $organizationId, cms_content_set_name: $cmsContentSetName}) {
    convention {
      id
      ...ConventionDisplayFields
    }
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;
export type CreateConventionMutationFn = Apollo.MutationFunction<CreateConventionMutation, CreateConventionMutationVariables>;

/**
 * __useCreateConventionMutation__
 *
 * To run a mutation, you first call `useCreateConventionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConventionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConventionMutation, { data, loading, error }] = useCreateConventionMutation({
 *   variables: {
 *      convention: // value for 'convention'
 *      cloneConventionId: // value for 'cloneConventionId'
 *      organizationId: // value for 'organizationId'
 *      cmsContentSetName: // value for 'cmsContentSetName'
 *   },
 * });
 */
export function useCreateConventionMutation(baseOptions?: Apollo.MutationHookOptions<CreateConventionMutation, CreateConventionMutationVariables>) {
        return Apollo.useMutation<CreateConventionMutation, CreateConventionMutationVariables>(CreateConventionDocument, baseOptions);
      }
export type CreateConventionMutationHookResult = ReturnType<typeof useCreateConventionMutation>;
export type CreateConventionMutationResult = Apollo.MutationResult<CreateConventionMutation>;
export type CreateConventionMutationOptions = Apollo.BaseMutationOptions<CreateConventionMutation, CreateConventionMutationVariables>;
export const SetConventionCanceledDocument = gql`
    mutation SetConventionCanceled($id: Int!, $canceled: Boolean!) {
  setConventionCanceled(input: {id: $id, canceled: $canceled}) {
    convention {
      id
      ...ConventionDisplayFields
    }
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;
export type SetConventionCanceledMutationFn = Apollo.MutationFunction<SetConventionCanceledMutation, SetConventionCanceledMutationVariables>;

/**
 * __useSetConventionCanceledMutation__
 *
 * To run a mutation, you first call `useSetConventionCanceledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetConventionCanceledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setConventionCanceledMutation, { data, loading, error }] = useSetConventionCanceledMutation({
 *   variables: {
 *      id: // value for 'id'
 *      canceled: // value for 'canceled'
 *   },
 * });
 */
export function useSetConventionCanceledMutation(baseOptions?: Apollo.MutationHookOptions<SetConventionCanceledMutation, SetConventionCanceledMutationVariables>) {
        return Apollo.useMutation<SetConventionCanceledMutation, SetConventionCanceledMutationVariables>(SetConventionCanceledDocument, baseOptions);
      }
export type SetConventionCanceledMutationHookResult = ReturnType<typeof useSetConventionCanceledMutation>;
export type SetConventionCanceledMutationResult = Apollo.MutationResult<SetConventionCanceledMutation>;
export type SetConventionCanceledMutationOptions = Apollo.BaseMutationOptions<SetConventionCanceledMutation, SetConventionCanceledMutationVariables>;