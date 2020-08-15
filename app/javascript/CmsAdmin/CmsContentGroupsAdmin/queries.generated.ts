/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { PermissionedRoleFields_OrganizationRole_Fragment, PermissionedRoleFields_StaffPosition_Fragment } from '../../Permissions/fragments.generated';
import { gql } from '@apollo/client';
import { PermissionedRoleFieldsFragmentDoc } from '../../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';


export type CmsContentFields_CmsLayout_Fragment = (
  { __typename: 'CmsLayout' }
  & Pick<Types.CmsLayout, 'id' | 'name'>
);

export type CmsContentFields_CmsPartial_Fragment = (
  { __typename: 'CmsPartial' }
  & Pick<Types.CmsPartial, 'id' | 'name'>
);

export type CmsContentFields_Page_Fragment = (
  { __typename: 'Page' }
  & Pick<Types.Page, 'id' | 'name'>
);

export type CmsContentFieldsFragment = CmsContentFields_CmsLayout_Fragment | CmsContentFields_CmsPartial_Fragment | CmsContentFields_Page_Fragment;

export type CmsContentGroupFieldsFragment = (
  { __typename?: 'CmsContentGroup' }
  & Pick<Types.CmsContentGroup, 'id' | 'name' | 'current_ability_can_update' | 'current_ability_can_delete'>
  & { contents: Array<(
    { __typename?: 'CmsLayout' }
    & CmsContentFields_CmsLayout_Fragment
  ) | (
    { __typename?: 'CmsPartial' }
    & CmsContentFields_CmsPartial_Fragment
  ) | (
    { __typename?: 'Page' }
    & CmsContentFields_Page_Fragment
  )>, permissions: Array<(
    { __typename?: 'Permission' }
    & Pick<Types.Permission, 'id' | 'permission'>
    & { role: (
      { __typename?: 'OrganizationRole' }
      & PermissionedRoleFields_OrganizationRole_Fragment
    ) | (
      { __typename?: 'StaffPosition' }
      & PermissionedRoleFields_StaffPosition_Fragment
    ) }
  )> }
);

export type CmsContentGroupsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsContentGroupsAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { staff_positions?: Types.Maybe<Array<(
      { __typename?: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id' | 'name'>
    )>> }
  )>, cmsContentGroups: Array<(
    { __typename?: 'CmsContentGroup' }
    & Pick<Types.CmsContentGroup, 'id'>
    & CmsContentGroupFieldsFragment
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_content_groups'>
  ) }
);

export type SearchCmsContentQueryQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type SearchCmsContentQueryQuery = (
  { __typename?: 'Query' }
  & { searchCmsContent: Array<(
    { __typename?: 'CmsLayout' }
    & CmsContentFields_CmsLayout_Fragment
  ) | (
    { __typename?: 'CmsPartial' }
    & CmsContentFields_CmsPartial_Fragment
  ) | (
    { __typename?: 'Page' }
    & CmsContentFields_Page_Fragment
  )> }
);

export const CmsContentFieldsFragmentDoc = gql`
    fragment CmsContentFields on CmsContent {
  __typename
  ... on Page {
    id
    name
  }
  ... on CmsPartial {
    id
    name
  }
  ... on CmsLayout {
    id
    name
  }
}
    `;
export const CmsContentGroupFieldsFragmentDoc = gql`
    fragment CmsContentGroupFields on CmsContentGroup {
  id
  name
  current_ability_can_update
  current_ability_can_delete
  contents {
    ...CmsContentFields
  }
  permissions {
    id
    permission
    role {
      ...PermissionedRoleFields
    }
  }
}
    ${CmsContentFieldsFragmentDoc}
${PermissionedRoleFieldsFragmentDoc}`;
export const CmsContentGroupsAdminQueryDocument = gql`
    query CmsContentGroupsAdminQuery {
  convention {
    id
    name
    staff_positions {
      id
      name
    }
  }
  cmsContentGroups {
    id
    ...CmsContentGroupFields
  }
  currentAbility {
    can_create_cms_content_groups
  }
}
    ${CmsContentGroupFieldsFragmentDoc}`;

/**
 * __useCmsContentGroupsAdminQueryQuery__
 *
 * To run a query within a React component, call `useCmsContentGroupsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsContentGroupsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsContentGroupsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsContentGroupsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsContentGroupsAdminQueryQuery, CmsContentGroupsAdminQueryQueryVariables>) {
        return Apollo.useQuery<CmsContentGroupsAdminQueryQuery, CmsContentGroupsAdminQueryQueryVariables>(CmsContentGroupsAdminQueryDocument, baseOptions);
      }
export function useCmsContentGroupsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsContentGroupsAdminQueryQuery, CmsContentGroupsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsContentGroupsAdminQueryQuery, CmsContentGroupsAdminQueryQueryVariables>(CmsContentGroupsAdminQueryDocument, baseOptions);
        }
export type CmsContentGroupsAdminQueryQueryHookResult = ReturnType<typeof useCmsContentGroupsAdminQueryQuery>;
export type CmsContentGroupsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsContentGroupsAdminQueryLazyQuery>;
export type CmsContentGroupsAdminQueryQueryResult = Apollo.QueryResult<CmsContentGroupsAdminQueryQuery, CmsContentGroupsAdminQueryQueryVariables>;
export const SearchCmsContentQueryDocument = gql`
    query SearchCmsContentQuery($name: String) {
  searchCmsContent(name: $name) {
    ...CmsContentFields
  }
}
    ${CmsContentFieldsFragmentDoc}`;

/**
 * __useSearchCmsContentQueryQuery__
 *
 * To run a query within a React component, call `useSearchCmsContentQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCmsContentQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCmsContentQueryQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchCmsContentQueryQuery(baseOptions?: Apollo.QueryHookOptions<SearchCmsContentQueryQuery, SearchCmsContentQueryQueryVariables>) {
        return Apollo.useQuery<SearchCmsContentQueryQuery, SearchCmsContentQueryQueryVariables>(SearchCmsContentQueryDocument, baseOptions);
      }
export function useSearchCmsContentQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCmsContentQueryQuery, SearchCmsContentQueryQueryVariables>) {
          return Apollo.useLazyQuery<SearchCmsContentQueryQuery, SearchCmsContentQueryQueryVariables>(SearchCmsContentQueryDocument, baseOptions);
        }
export type SearchCmsContentQueryQueryHookResult = ReturnType<typeof useSearchCmsContentQueryQuery>;
export type SearchCmsContentQueryLazyQueryHookResult = ReturnType<typeof useSearchCmsContentQueryLazyQuery>;
export type SearchCmsContentQueryQueryResult = Apollo.QueryResult<SearchCmsContentQueryQuery, SearchCmsContentQueryQueryVariables>;