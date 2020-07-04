/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CmsFileFieldsFragment } from './queries.generated';
import gql from 'graphql-tag';
import { CmsFileFieldsFragmentDoc } from './queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type CreateCmsFileMutationVariables = Exact<{
  file: Types.Scalars['Upload'];
}>;


export type CreateCmsFileMutation = (
  { __typename?: 'Mutation' }
  & { createCmsFile?: Types.Maybe<(
    { __typename?: 'CreateCmsFilePayload' }
    & { cms_file: (
      { __typename?: 'CmsFile' }
      & Pick<Types.CmsFile, 'id'>
      & CmsFileFieldsFragment
    ) }
  )> }
);

export type RenameCmsFileMutationVariables = Exact<{
  id: Types.Scalars['Int'];
  filename: Types.Scalars['String'];
}>;


export type RenameCmsFileMutation = (
  { __typename?: 'Mutation' }
  & { renameCmsFile?: Types.Maybe<(
    { __typename?: 'RenameCmsFilePayload' }
    & { cms_file: (
      { __typename?: 'CmsFile' }
      & Pick<Types.CmsFile, 'id'>
      & CmsFileFieldsFragment
    ) }
  )> }
);

export type DeleteCmsFileMutationVariables = Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCmsFileMutation = (
  { __typename?: 'Mutation' }
  & { deleteCmsFile?: Types.Maybe<(
    { __typename?: 'DeleteCmsFilePayload' }
    & Pick<Types.DeleteCmsFilePayload, 'clientMutationId'>
  )> }
);


export const CreateCmsFileDocument = gql`
    mutation CreateCmsFile($file: Upload!) {
  createCmsFile(input: {file: $file}) {
    cms_file {
      id
      ...CmsFileFields
    }
  }
}
    ${CmsFileFieldsFragmentDoc}`;
export type CreateCmsFileMutationFn = ApolloReactCommon.MutationFunction<CreateCmsFileMutation, CreateCmsFileMutationVariables>;

/**
 * __useCreateCmsFileMutation__
 *
 * To run a mutation, you first call `useCreateCmsFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCmsFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCmsFileMutation, { data, loading, error }] = useCreateCmsFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateCmsFileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCmsFileMutation, CreateCmsFileMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCmsFileMutation, CreateCmsFileMutationVariables>(CreateCmsFileDocument, baseOptions);
      }
export type CreateCmsFileMutationHookResult = ReturnType<typeof useCreateCmsFileMutation>;
export type CreateCmsFileMutationResult = ApolloReactCommon.MutationResult<CreateCmsFileMutation>;
export type CreateCmsFileMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCmsFileMutation, CreateCmsFileMutationVariables>;
export const RenameCmsFileDocument = gql`
    mutation RenameCmsFile($id: Int!, $filename: String!) {
  renameCmsFile(input: {id: $id, filename: $filename}) {
    cms_file {
      id
      ...CmsFileFields
    }
  }
}
    ${CmsFileFieldsFragmentDoc}`;
export type RenameCmsFileMutationFn = ApolloReactCommon.MutationFunction<RenameCmsFileMutation, RenameCmsFileMutationVariables>;

/**
 * __useRenameCmsFileMutation__
 *
 * To run a mutation, you first call `useRenameCmsFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameCmsFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameCmsFileMutation, { data, loading, error }] = useRenameCmsFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useRenameCmsFileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RenameCmsFileMutation, RenameCmsFileMutationVariables>) {
        return ApolloReactHooks.useMutation<RenameCmsFileMutation, RenameCmsFileMutationVariables>(RenameCmsFileDocument, baseOptions);
      }
export type RenameCmsFileMutationHookResult = ReturnType<typeof useRenameCmsFileMutation>;
export type RenameCmsFileMutationResult = ApolloReactCommon.MutationResult<RenameCmsFileMutation>;
export type RenameCmsFileMutationOptions = ApolloReactCommon.BaseMutationOptions<RenameCmsFileMutation, RenameCmsFileMutationVariables>;
export const DeleteCmsFileDocument = gql`
    mutation DeleteCmsFile($id: Int!) {
  deleteCmsFile(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteCmsFileMutationFn = ApolloReactCommon.MutationFunction<DeleteCmsFileMutation, DeleteCmsFileMutationVariables>;

/**
 * __useDeleteCmsFileMutation__
 *
 * To run a mutation, you first call `useDeleteCmsFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCmsFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCmsFileMutation, { data, loading, error }] = useDeleteCmsFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCmsFileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCmsFileMutation, DeleteCmsFileMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCmsFileMutation, DeleteCmsFileMutationVariables>(DeleteCmsFileDocument, baseOptions);
      }
export type DeleteCmsFileMutationHookResult = ReturnType<typeof useDeleteCmsFileMutation>;
export type DeleteCmsFileMutationResult = ApolloReactCommon.MutationResult<DeleteCmsFileMutation>;
export type DeleteCmsFileMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCmsFileMutation, DeleteCmsFileMutationVariables>;