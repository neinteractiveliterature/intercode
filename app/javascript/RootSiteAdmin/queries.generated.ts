/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type PageFieldsFragment = (
  { __typename: 'Page' }
  & Pick<Types.Page, 'id' | 'name'>
);

export type RootSiteAdminLayoutFieldsFragment = (
  { __typename: 'CmsLayout' }
  & Pick<Types.CmsLayout, 'id' | 'name'>
);

export type RootSiteFieldsFragment = (
  { __typename: 'RootSite' }
  & Pick<Types.RootSite, 'id' | 'site_name'>
  & { root_page: (
    { __typename: 'Page' }
    & Pick<Types.Page, 'id'>
    & PageFieldsFragment
  ), default_layout: (
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id'>
    & RootSiteAdminLayoutFieldsFragment
  ) }
);

export type RootSiteAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RootSiteAdminQueryQuery = (
  { __typename: 'Query' }
  & { rootSite: (
    { __typename: 'RootSite' }
    & Pick<Types.RootSite, 'id'>
    & RootSiteFieldsFragment
  ), cmsPages: Array<(
    { __typename: 'Page' }
    & Pick<Types.Page, 'id'>
    & PageFieldsFragment
  )>, cmsLayouts: Array<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id'>
    & RootSiteAdminLayoutFieldsFragment
  )> }
);

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
  root_page {
    id
    ...PageFields
  }
  default_layout {
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
  cmsPages {
    id
    ...PageFields
  }
  cmsLayouts {
    id
    ...RootSiteAdminLayoutFields
  }
}
    ${RootSiteFieldsFragmentDoc}
${PageFieldsFragmentDoc}
${RootSiteAdminLayoutFieldsFragmentDoc}`;

/**
 * __useRootSiteAdminQueryQuery__
 *
 * To run a query within a React component, call `useRootSiteAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootSiteAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootSiteAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useRootSiteAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<RootSiteAdminQueryQuery, RootSiteAdminQueryQueryVariables>) {
        return Apollo.useQuery<RootSiteAdminQueryQuery, RootSiteAdminQueryQueryVariables>(RootSiteAdminQueryDocument, baseOptions);
      }
export function useRootSiteAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootSiteAdminQueryQuery, RootSiteAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<RootSiteAdminQueryQuery, RootSiteAdminQueryQueryVariables>(RootSiteAdminQueryDocument, baseOptions);
        }
export type RootSiteAdminQueryQueryHookResult = ReturnType<typeof useRootSiteAdminQueryQuery>;
export type RootSiteAdminQueryLazyQueryHookResult = ReturnType<typeof useRootSiteAdminQueryLazyQuery>;
export type RootSiteAdminQueryQueryResult = Apollo.QueryResult<RootSiteAdminQueryQuery, RootSiteAdminQueryQueryVariables>;