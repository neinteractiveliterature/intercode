/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RootSiteFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UpdateRootSiteMutationVariables = Types.Exact<{
  siteName?: Types.Maybe<Types.Scalars['String']>;
  defaultLayoutId?: Types.Maybe<Types.Scalars['ID']>;
  rootPageId?: Types.Maybe<Types.Scalars['ID']>;
}>;


export type UpdateRootSiteMutationData = { __typename: 'Mutation', updateRootSite: { __typename: 'UpdateRootSitePayload', root_site: { __typename: 'RootSite', id: string, site_name: string, rootPage: { __typename: 'Page', id: string, name?: string | null | undefined }, defaultLayout: { __typename: 'CmsLayout', id: string, name?: string | null | undefined }, cmsPages: Array<{ __typename: 'Page', id: string, name?: string | null | undefined }>, cmsLayouts: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined }> } } };


export const UpdateRootSiteDocument = gql`
    mutation UpdateRootSite($siteName: String, $defaultLayoutId: ID, $rootPageId: ID) {
  updateRootSite(
    input: {root_site: {site_name: $siteName, defaultLayoutId: $defaultLayoutId, rootPageId: $rootPageId}}
  ) {
    root_site {
      id
      ...RootSiteFields
    }
  }
}
    ${RootSiteFieldsFragmentDoc}`;
export type UpdateRootSiteMutationFn = Apollo.MutationFunction<UpdateRootSiteMutationData, UpdateRootSiteMutationVariables>;

/**
 * __useUpdateRootSiteMutation__
 *
 * To run a mutation, you first call `useUpdateRootSiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRootSiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRootSiteMutation, { data, loading, error }] = useUpdateRootSiteMutation({
 *   variables: {
 *      siteName: // value for 'siteName'
 *      defaultLayoutId: // value for 'defaultLayoutId'
 *      rootPageId: // value for 'rootPageId'
 *   },
 * });
 */
export function useUpdateRootSiteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRootSiteMutationData, UpdateRootSiteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRootSiteMutationData, UpdateRootSiteMutationVariables>(UpdateRootSiteDocument, options);
      }
export type UpdateRootSiteMutationHookResult = ReturnType<typeof useUpdateRootSiteMutation>;
export type UpdateRootSiteMutationResult = Apollo.MutationResult<UpdateRootSiteMutationData>;
export type UpdateRootSiteMutationOptions = Apollo.BaseMutationOptions<UpdateRootSiteMutationData, UpdateRootSiteMutationVariables>;