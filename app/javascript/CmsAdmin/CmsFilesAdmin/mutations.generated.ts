/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CmsFileFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateCmsFileMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload'];
}>;


export type CreateCmsFileMutationData = { __typename: 'Mutation', createCmsFile: { __typename: 'CreateCmsFilePayload', cms_file: { __typename: 'CmsFile', id: string, current_ability_can_delete: boolean, file: { __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number, thumbnailUrl?: string | null | undefined } } } };

export type RenameCmsFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  filename: Types.Scalars['String'];
}>;


export type RenameCmsFileMutationData = { __typename: 'Mutation', renameCmsFile: { __typename: 'RenameCmsFilePayload', cms_file: { __typename: 'CmsFile', id: string, current_ability_can_delete: boolean, file: { __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number, thumbnailUrl?: string | null | undefined } } } };

export type DeleteCmsFileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteCmsFileMutationData = { __typename: 'Mutation', deleteCmsFile: { __typename: 'DeleteCmsFilePayload', clientMutationId?: string | null | undefined } };


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
export type CreateCmsFileMutationFn = Apollo.MutationFunction<CreateCmsFileMutationData, CreateCmsFileMutationVariables>;

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
export function useCreateCmsFileMutation(baseOptions?: Apollo.MutationHookOptions<CreateCmsFileMutationData, CreateCmsFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCmsFileMutationData, CreateCmsFileMutationVariables>(CreateCmsFileDocument, options);
      }
export type CreateCmsFileMutationHookResult = ReturnType<typeof useCreateCmsFileMutation>;
export type CreateCmsFileMutationResult = Apollo.MutationResult<CreateCmsFileMutationData>;
export type CreateCmsFileMutationOptions = Apollo.BaseMutationOptions<CreateCmsFileMutationData, CreateCmsFileMutationVariables>;
export const RenameCmsFileDocument = gql`
    mutation RenameCmsFile($id: ID!, $filename: String!) {
  renameCmsFile(input: {id: $id, filename: $filename}) {
    cms_file {
      id
      ...CmsFileFields
    }
  }
}
    ${CmsFileFieldsFragmentDoc}`;
export type RenameCmsFileMutationFn = Apollo.MutationFunction<RenameCmsFileMutationData, RenameCmsFileMutationVariables>;

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
export function useRenameCmsFileMutation(baseOptions?: Apollo.MutationHookOptions<RenameCmsFileMutationData, RenameCmsFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameCmsFileMutationData, RenameCmsFileMutationVariables>(RenameCmsFileDocument, options);
      }
export type RenameCmsFileMutationHookResult = ReturnType<typeof useRenameCmsFileMutation>;
export type RenameCmsFileMutationResult = Apollo.MutationResult<RenameCmsFileMutationData>;
export type RenameCmsFileMutationOptions = Apollo.BaseMutationOptions<RenameCmsFileMutationData, RenameCmsFileMutationVariables>;
export const DeleteCmsFileDocument = gql`
    mutation DeleteCmsFile($id: ID!) {
  deleteCmsFile(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteCmsFileMutationFn = Apollo.MutationFunction<DeleteCmsFileMutationData, DeleteCmsFileMutationVariables>;

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
export function useDeleteCmsFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCmsFileMutationData, DeleteCmsFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCmsFileMutationData, DeleteCmsFileMutationVariables>(DeleteCmsFileDocument, options);
      }
export type DeleteCmsFileMutationHookResult = ReturnType<typeof useDeleteCmsFileMutation>;
export type DeleteCmsFileMutationResult = Apollo.MutationResult<DeleteCmsFileMutationData>;
export type DeleteCmsFileMutationOptions = Apollo.BaseMutationOptions<DeleteCmsFileMutationData, DeleteCmsFileMutationVariables>;