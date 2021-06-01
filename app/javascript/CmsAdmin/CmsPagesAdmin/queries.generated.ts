/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsPageAdminLayoutFieldsFragment = (
  { __typename: 'CmsLayout' }
  & Pick<Types.CmsLayout, 'id' | 'name'>
);

export type CmsPageFieldsFragment = (
  { __typename: 'Page' }
  & Pick<Types.Page, 'id' | 'name' | 'slug' | 'content' | 'admin_notes' | 'skip_clickwrap_agreement' | 'hidden_from_search' | 'current_ability_can_update' | 'current_ability_can_delete'>
  & { cms_layout?: Types.Maybe<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id'>
    & CmsPageAdminLayoutFieldsFragment
  )> }
);

export type CmsPagesAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsPagesAdminQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_pages'>
  ), cmsPages: Array<(
    { __typename: 'Page' }
    & Pick<Types.Page, 'id'>
    & CmsPageFieldsFragment
  )>, cmsParent: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { default_layout?: Types.Maybe<(
      { __typename: 'CmsLayout' }
      & Pick<Types.CmsLayout, 'id'>
      & CmsPageAdminLayoutFieldsFragment
    )> }
  ) | (
    { __typename: 'RootSite' }
    & Pick<Types.RootSite, 'id'>
    & { root_site_default_layout: (
      { __typename: 'CmsLayout' }
      & Pick<Types.CmsLayout, 'id'>
      & CmsPageAdminLayoutFieldsFragment
    ) }
  ), cmsLayouts: Array<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id'>
    & CmsPageAdminLayoutFieldsFragment
  )> }
);

export const CmsPageAdminLayoutFieldsFragmentDoc = gql`
    fragment CmsPageAdminLayoutFields on CmsLayout {
  id
  name
}
    `;
export const CmsPageFieldsFragmentDoc = gql`
    fragment CmsPageFields on Page {
  id
  name
  slug
  content
  admin_notes
  skip_clickwrap_agreement
  hidden_from_search
  current_ability_can_update
  current_ability_can_delete
  cms_layout {
    id
    ...CmsPageAdminLayoutFields
  }
}
    ${CmsPageAdminLayoutFieldsFragmentDoc}`;
export const CmsPagesAdminQueryDocument = gql`
    query CmsPagesAdminQuery {
  convention {
    id
    name
  }
  currentAbility {
    can_create_pages
  }
  cmsPages {
    id
    ...CmsPageFields
  }
  cmsParent {
    ... on RootSite {
      id
      root_site_default_layout: default_layout {
        id
        ...CmsPageAdminLayoutFields
      }
    }
    ... on Convention {
      id
      default_layout {
        id
        ...CmsPageAdminLayoutFields
      }
    }
  }
  cmsLayouts {
    id
    ...CmsPageAdminLayoutFields
  }
}
    ${CmsPageFieldsFragmentDoc}
${CmsPageAdminLayoutFieldsFragmentDoc}`;

/**
 * __useCmsPagesAdminQuery__
 *
 * To run a query within a React component, call `useCmsPagesAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPagesAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPagesAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsPagesAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>(CmsPagesAdminQueryDocument, options);
      }
export function useCmsPagesAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>(CmsPagesAdminQueryDocument, options);
        }
export type CmsPagesAdminQueryHookResult = ReturnType<typeof useCmsPagesAdminQuery>;
export type CmsPagesAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsPagesAdminQueryLazyQuery>;
export type CmsPagesAdminQueryQueryResult = Apollo.QueryResult<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>;