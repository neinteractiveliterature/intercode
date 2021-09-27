/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type PageFieldsFragment = { __typename: 'Page', id: number, name?: Types.Maybe<string> };

export type RootSiteAdminLayoutFieldsFragment = { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> };

export type RootSiteFieldsFragment = { __typename: 'RootSite', id: number, site_name: string, rootPage: { __typename: 'Page', id: number, name?: Types.Maybe<string> }, defaultLayout: { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }, cmsPages: Array<{ __typename: 'Page', id: number, name?: Types.Maybe<string> }>, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }> };

export type RootSiteAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RootSiteAdminQueryData = { __typename: 'Query', rootSite: { __typename: 'RootSite', id: number, site_name: string, rootPage: { __typename: 'Page', id: number, name?: Types.Maybe<string> }, defaultLayout: { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }, cmsPages: Array<{ __typename: 'Page', id: number, name?: Types.Maybe<string> }>, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }> } };

export const PageFieldsFragmentDoc = gql`
    fragment PageFields on Page {
  id
  name
}
    `;
export const RootSiteAdminLayoutFieldsFragmentDoc = gql`
    fragment RootSiteAdminLayoutFields on CmsLayout {
  id
  name
}
    `;
export const RootSiteFieldsFragmentDoc = gql`
    fragment RootSiteFields on RootSite {
  id
  site_name
  rootPage {
    id
    ...PageFields
  }
  defaultLayout {
    id
    ...RootSiteAdminLayoutFields
  }
  cmsPages {
    id
    ...PageFields
  }
  cmsLayouts {
    id
    ...RootSiteAdminLayoutFields
  }
}
    ${PageFieldsFragmentDoc}
${RootSiteAdminLayoutFieldsFragmentDoc}`;
export const RootSiteAdminQueryDocument = gql`
    query RootSiteAdminQuery {
  rootSite {
    id
    ...RootSiteFields
  }
}
    ${RootSiteFieldsFragmentDoc}`;

/**
 * __useRootSiteAdminQuery__
 *
 * To run a query within a React component, call `useRootSiteAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useRootSiteAdminQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteAdminQueryData, RootSiteAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RootSiteAdminQueryData, RootSiteAdminQueryVariables>(RootSiteAdminQueryDocument, options);
      }
export function useRootSiteAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteAdminQueryData, RootSiteAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RootSiteAdminQueryData, RootSiteAdminQueryVariables>(RootSiteAdminQueryDocument, options);
        }
export type RootSiteAdminQueryHookResult = ReturnType<typeof useRootSiteAdminQuery>;
export type RootSiteAdminQueryLazyQueryHookResult = ReturnType<typeof useRootSiteAdminQueryLazyQuery>;
export type RootSiteAdminQueryQueryResult = Apollo.QueryResult<RootSiteAdminQueryData, RootSiteAdminQueryVariables>;