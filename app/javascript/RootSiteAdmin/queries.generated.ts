/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
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

export type RootSiteAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RootSiteAdminQueryData = (
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