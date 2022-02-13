/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CmsGraphqlQueryFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateCmsGraphqlQueryMutationVariables = Types.Exact<{
  query: Types.CmsGraphqlQueryInput;
}>;


export type CreateCmsGraphqlQueryMutationData = { __typename: 'Mutation', createCmsGraphqlQuery: { __typename: 'CreateCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string, identifier: string, query: string, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type UpdateCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  query: Types.CmsGraphqlQueryInput;
}>;


export type UpdateCmsGraphqlQueryMutationData = { __typename: 'Mutation', updateCmsGraphqlQuery: { __typename: 'UpdateCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string, identifier: string, query: string, admin_notes?: string | null, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteCmsGraphqlQueryMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteCmsGraphqlQueryMutationData = { __typename: 'Mutation', deleteCmsGraphqlQuery: { __typename: 'DeleteCmsGraphqlQueryPayload', query: { __typename: 'CmsGraphqlQuery', id: string } } };


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
export type CreateCmsGraphqlQueryMutationFn = Apollo.MutationFunction<CreateCmsGraphqlQueryMutationData, CreateCmsGraphqlQueryMutationVariables>;

/**
 * __useCreateCmsGraphqlQuery__
 *
 * To run a mutation, you first call `useCreateCmsGraphqlQuery` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCmsGraphqlQuery` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCmsGraphqlQuery, { data, loading, error }] = useCreateCmsGraphqlQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCreateCmsGraphqlQuery(baseOptions?: Apollo.MutationHookOptions<CreateCmsGraphqlQueryMutationData, CreateCmsGraphqlQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCmsGraphqlQueryMutationData, CreateCmsGraphqlQueryMutationVariables>(CreateCmsGraphqlQueryDocument, options);
      }
export type CreateCmsGraphqlQueryHookResult = ReturnType<typeof useCreateCmsGraphqlQuery>;
export type CreateCmsGraphqlQueryMutationResult = Apollo.MutationResult<CreateCmsGraphqlQueryMutationData>;
export type CreateCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<CreateCmsGraphqlQueryMutationData, CreateCmsGraphqlQueryMutationVariables>;
export const UpdateCmsGraphqlQueryDocument = gql`
    mutation UpdateCmsGraphqlQuery($id: ID!, $query: CmsGraphqlQueryInput!) {
  updateCmsGraphqlQuery(input: {id: $id, query: $query}) {
    query {
      id
      ...CmsGraphqlQueryFields
    }
  }
}
    ${CmsGraphqlQueryFieldsFragmentDoc}`;
export type UpdateCmsGraphqlQueryMutationFn = Apollo.MutationFunction<UpdateCmsGraphqlQueryMutationData, UpdateCmsGraphqlQueryMutationVariables>;

/**
 * __useUpdateCmsGraphqlQuery__
 *
 * To run a mutation, you first call `useUpdateCmsGraphqlQuery` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCmsGraphqlQuery` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCmsGraphqlQuery, { data, loading, error }] = useUpdateCmsGraphqlQuery({
 *   variables: {
 *      id: // value for 'id'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useUpdateCmsGraphqlQuery(baseOptions?: Apollo.MutationHookOptions<UpdateCmsGraphqlQueryMutationData, UpdateCmsGraphqlQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCmsGraphqlQueryMutationData, UpdateCmsGraphqlQueryMutationVariables>(UpdateCmsGraphqlQueryDocument, options);
      }
export type UpdateCmsGraphqlQueryHookResult = ReturnType<typeof useUpdateCmsGraphqlQuery>;
export type UpdateCmsGraphqlQueryMutationResult = Apollo.MutationResult<UpdateCmsGraphqlQueryMutationData>;
export type UpdateCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<UpdateCmsGraphqlQueryMutationData, UpdateCmsGraphqlQueryMutationVariables>;
export const DeleteCmsGraphqlQueryDocument = gql`
    mutation DeleteCmsGraphqlQuery($id: ID!) {
  deleteCmsGraphqlQuery(input: {id: $id}) {
    query {
      id
    }
  }
}
    `;
export type DeleteCmsGraphqlQueryMutationFn = Apollo.MutationFunction<DeleteCmsGraphqlQueryMutationData, DeleteCmsGraphqlQueryMutationVariables>;

/**
 * __useDeleteCmsGraphqlQuery__
 *
 * To run a mutation, you first call `useDeleteCmsGraphqlQuery` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCmsGraphqlQuery` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCmsGraphqlQuery, { data, loading, error }] = useDeleteCmsGraphqlQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCmsGraphqlQuery(baseOptions?: Apollo.MutationHookOptions<DeleteCmsGraphqlQueryMutationData, DeleteCmsGraphqlQueryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCmsGraphqlQueryMutationData, DeleteCmsGraphqlQueryMutationVariables>(DeleteCmsGraphqlQueryDocument, options);
      }
export type DeleteCmsGraphqlQueryHookResult = ReturnType<typeof useDeleteCmsGraphqlQuery>;
export type DeleteCmsGraphqlQueryMutationResult = Apollo.MutationResult<DeleteCmsGraphqlQueryMutationData>;
export type DeleteCmsGraphqlQueryMutationOptions = Apollo.BaseMutationOptions<DeleteCmsGraphqlQueryMutationData, DeleteCmsGraphqlQueryMutationVariables>;