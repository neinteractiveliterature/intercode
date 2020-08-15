/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CmsGraphqlQueryFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { CmsGraphqlQueryFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type CreateCmsGraphqlQueryMutationVariables = Types.Exact<{
  query: Types.CmsGraphqlQueryInput;
}>;


export type CreateCmsGraphqlQueryMutation = (
  { __typename?: 'Mutation' }
  & { createCmsGraphqlQuery?: Types.Maybe<(
    { __typename?: 'CreateCmsGraphqlQueryPayload' }
    & { query: (
      { __typename?: 'CmsGraphqlQuery' }
      & Pick<Types.CmsGraphqlQuery, 'id'>
      & CmsGraphqlQueryFieldsFragment
    ) }
  )> }
);

export type UpdateCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  query: Types.CmsGraphqlQueryInput;
}>;


export type UpdateCmsGraphqlQueryMutation = (
  { __typename?: 'Mutation' }
  & { updateCmsGraphqlQuery?: Types.Maybe<(
    { __typename?: 'UpdateCmsGraphqlQueryPayload' }
    & { query: (
      { __typename?: 'CmsGraphqlQuery' }
      & Pick<Types.CmsGraphqlQuery, 'id'>
      & CmsGraphqlQueryFieldsFragment
    ) }
  )> }
);

export type DeleteCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCmsGraphqlQueryMutation = (
  { __typename?: 'Mutation' }
  & { deleteCmsGraphqlQuery?: Types.Maybe<(
    { __typename?: 'DeleteCmsGraphqlQueryPayload' }
    & { query: (
      { __typename?: 'CmsGraphqlQuery' }
      & Pick<Types.CmsGraphqlQuery, 'id'>
    ) }
  )> }
);


export const CreateCmsGraphqlQueryDocument = gql`
    mutation CreateCmsGraphqlQuery($query: CmsGraphqlQueryInput!) {
  createCmsGraphqlQuery(input: {query: $query}) {
    query {
      id
      ...CmsGraphqlQueryFields
    }
  }
}
    ${CmsGraphqlQueryFieldsFragmentDoc}`;
export type CreateCmsGraphqlQueryMutationFn = Apollo.MutationFunction<CreateCmsGraphqlQueryMutation, CreateCmsGraphqlQueryMutationVariables>;

/**
 * __useCreateCmsGraphqlQueryMutation__
 *
 * To run a mutation, you first call `useCreateCmsGraphqlQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCmsGraphqlQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCmsGraphqlQueryMutation, { data, loading, error }] = useCreateCmsGraphqlQueryMutation({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCreateCmsGraphqlQueryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCmsGraphqlQueryMutation, CreateCmsGraphqlQueryMutationVariables>) {
        return Apollo.useMutation<CreateCmsGraphqlQueryMutation, CreateCmsGraphqlQueryMutationVariables>(CreateCmsGraphqlQueryDocument, baseOptions);
      }
export type CreateCmsGraphqlQueryMutationHookResult = ReturnType<typeof useCreateCmsGraphqlQueryMutation>;
export type CreateCmsGraphqlQueryMutationResult = Apollo.MutationResult<CreateCmsGraphqlQueryMutation>;
export type CreateCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<CreateCmsGraphqlQueryMutation, CreateCmsGraphqlQueryMutationVariables>;
export const UpdateCmsGraphqlQueryDocument = gql`
    mutation UpdateCmsGraphqlQuery($id: Int!, $query: CmsGraphqlQueryInput!) {
  updateCmsGraphqlQuery(input: {id: $id, query: $query}) {
    query {
      id
      ...CmsGraphqlQueryFields
    }
  }
}
    ${CmsGraphqlQueryFieldsFragmentDoc}`;
export type UpdateCmsGraphqlQueryMutationFn = Apollo.MutationFunction<UpdateCmsGraphqlQueryMutation, UpdateCmsGraphqlQueryMutationVariables>;

/**
 * __useUpdateCmsGraphqlQueryMutation__
 *
 * To run a mutation, you first call `useUpdateCmsGraphqlQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCmsGraphqlQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCmsGraphqlQueryMutation, { data, loading, error }] = useUpdateCmsGraphqlQueryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useUpdateCmsGraphqlQueryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCmsGraphqlQueryMutation, UpdateCmsGraphqlQueryMutationVariables>) {
        return Apollo.useMutation<UpdateCmsGraphqlQueryMutation, UpdateCmsGraphqlQueryMutationVariables>(UpdateCmsGraphqlQueryDocument, baseOptions);
      }
export type UpdateCmsGraphqlQueryMutationHookResult = ReturnType<typeof useUpdateCmsGraphqlQueryMutation>;
export type UpdateCmsGraphqlQueryMutationResult = Apollo.MutationResult<UpdateCmsGraphqlQueryMutation>;
export type UpdateCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<UpdateCmsGraphqlQueryMutation, UpdateCmsGraphqlQueryMutationVariables>;
export const DeleteCmsGraphqlQueryDocument = gql`
    mutation DeleteCmsGraphqlQuery($id: Int!) {
  deleteCmsGraphqlQuery(input: {id: $id}) {
    query {
      id
    }
  }
}
    `;
export type DeleteCmsGraphqlQueryMutationFn = Apollo.MutationFunction<DeleteCmsGraphqlQueryMutation, DeleteCmsGraphqlQueryMutationVariables>;

/**
 * __useDeleteCmsGraphqlQueryMutation__
 *
 * To run a mutation, you first call `useDeleteCmsGraphqlQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCmsGraphqlQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCmsGraphqlQueryMutation, { data, loading, error }] = useDeleteCmsGraphqlQueryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCmsGraphqlQueryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCmsGraphqlQueryMutation, DeleteCmsGraphqlQueryMutationVariables>) {
        return Apollo.useMutation<DeleteCmsGraphqlQueryMutation, DeleteCmsGraphqlQueryMutationVariables>(DeleteCmsGraphqlQueryDocument, baseOptions);
      }
export type DeleteCmsGraphqlQueryMutationHookResult = ReturnType<typeof useDeleteCmsGraphqlQueryMutation>;
export type DeleteCmsGraphqlQueryMutationResult = Apollo.MutationResult<DeleteCmsGraphqlQueryMutation>;
export type DeleteCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<DeleteCmsGraphqlQueryMutation, DeleteCmsGraphqlQueryMutationVariables>;