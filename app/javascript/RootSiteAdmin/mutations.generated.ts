/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { RootSiteFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { RootSiteFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type UpdateRootSiteMutationVariables = Types.Exact<{
  siteName?: Types.Maybe<Types.Scalars['String']>;
  defaultLayoutId?: Types.Maybe<Types.Scalars['Int']>;
  rootPageId?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type UpdateRootSiteMutation = (
  { __typename: 'Mutation' }
  & { updateRootSite?: Types.Maybe<(
    { __typename: 'UpdateRootSitePayload' }
    & { root_site: (
      { __typename: 'RootSite' }
      & Pick<Types.RootSite, 'id'>
      & RootSiteFieldsFragment
    ) }
  )> }
);


export const UpdateRootSiteDocument = gql`
    mutation UpdateRootSite($siteName: String, $defaultLayoutId: Int, $rootPageId: Int) {
  updateRootSite(input: {root_site: {site_name: $siteName, default_layout_id: $defaultLayoutId, root_page_id: $rootPageId}}) {
    root_site {
      id
      ...RootSiteFields
    }
  }
}
    ${RootSiteFieldsFragmentDoc}`;
export type UpdateRootSiteMutationFn = Apollo.MutationFunction<UpdateRootSiteMutation, UpdateRootSiteMutationVariables>;

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
export function useUpdateRootSiteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRootSiteMutation, UpdateRootSiteMutationVariables>) {
        return Apollo.useMutation<UpdateRootSiteMutation, UpdateRootSiteMutationVariables>(UpdateRootSiteDocument, baseOptions);
      }
export type UpdateRootSiteMutationHookResult = ReturnType<typeof useUpdateRootSiteMutation>;
export type UpdateRootSiteMutationResult = Apollo.MutationResult<UpdateRootSiteMutation>;
export type UpdateRootSiteMutationOptions = Apollo.BaseMutationOptions<UpdateRootSiteMutation, UpdateRootSiteMutationVariables>;