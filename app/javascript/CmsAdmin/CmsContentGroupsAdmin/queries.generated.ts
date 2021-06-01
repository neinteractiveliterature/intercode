/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { PermissionedModelFields_CmsContentGroup_Fragment, PermissionedModelFields_Convention_Fragment, PermissionedModelFields_EventCategory_Fragment, PermissionedRoleFields_OrganizationRole_Fragment, PermissionedRoleFields_StaffPosition_Fragment } from '../../Permissions/fragments.generated';
import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
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
  { __typename: 'CmsContentGroup' }
  & Pick<Types.CmsContentGroup, 'id' | 'name' | 'current_ability_can_update' | 'current_ability_can_delete'>
  & { contents: Array<(
    { __typename: 'CmsLayout' }
    & CmsContentFields_CmsLayout_Fragment
  ) | (
    { __typename: 'CmsPartial' }
    & CmsContentFields_CmsPartial_Fragment
  ) | (
    { __typename: 'Page' }
    & CmsContentFields_Page_Fragment
  )>, permissions: Array<(
    { __typename: 'Permission' }
    & Pick<Types.Permission, 'id' | 'permission'>
    & { model: (
      { __typename: 'CmsContentGroup' }
      & PermissionedModelFields_CmsContentGroup_Fragment
    ) | (
      { __typename: 'Convention' }
      & PermissionedModelFields_Convention_Fragment
    ) | (
      { __typename: 'EventCategory' }
      & PermissionedModelFields_EventCategory_Fragment
    ), role: (
      { __typename: 'OrganizationRole' }
      & PermissionedRoleFields_OrganizationRole_Fragment
    ) | (
      { __typename: 'StaffPosition' }
      & PermissionedRoleFields_StaffPosition_Fragment
    ) }
  )> }
);

export type CmsContentGroupsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsContentGroupsAdminQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { staff_positions: Array<(
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id' | 'name'>
    )> }
  )>, cmsContentGroups: Array<(
    { __typename: 'CmsContentGroup' }
    & Pick<Types.CmsContentGroup, 'id'>
    & CmsContentGroupFieldsFragment
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_content_groups'>
  ) }
);

export type SearchCmsContentQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type SearchCmsContentQueryData = (
  { __typename: 'Query' }
  & { searchCmsContent: Array<(
    { __typename: 'CmsLayout' }
    & CmsContentFields_CmsLayout_Fragment
  ) | (
    { __typename: 'CmsPartial' }
    & CmsContentFields_CmsPartial_Fragment
  ) | (
    { __typename: 'Page' }
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
    model {
      ...PermissionedModelFields
    }
    role {
      ...PermissionedRoleFields
    }
  }
}
    ${CmsContentFieldsFragmentDoc}
${PermissionedModelFieldsFragmentDoc}
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
 * __useCmsContentGroupsAdminQuery__
 *
 * To run a query within a React component, call `useCmsContentGroupsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsContentGroupsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsContentGroupsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsContentGroupsAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryVariables>(CmsContentGroupsAdminQueryDocument, options);
      }
export function useCmsContentGroupsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryVariables>(CmsContentGroupsAdminQueryDocument, options);
        }
export type CmsContentGroupsAdminQueryHookResult = ReturnType<typeof useCmsContentGroupsAdminQuery>;
export type CmsContentGroupsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsContentGroupsAdminQueryLazyQuery>;
export type CmsContentGroupsAdminQueryQueryResult = Apollo.QueryResult<CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryVariables>;
export const SearchCmsContentQueryDocument = gql`
    query SearchCmsContentQuery($name: String) {
  searchCmsContent(name: $name) {
    ...CmsContentFields
  }
}
    ${CmsContentFieldsFragmentDoc}`;

/**
 * __useSearchCmsContentQuery__
 *
 * To run a query within a React component, call `useSearchCmsContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCmsContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCmsContentQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchCmsContentQuery(baseOptions?: Apollo.QueryHookOptions<SearchCmsContentQueryData, SearchCmsContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCmsContentQueryData, SearchCmsContentQueryVariables>(SearchCmsContentQueryDocument, options);
      }
export function useSearchCmsContentQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCmsContentQueryData, SearchCmsContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCmsContentQueryData, SearchCmsContentQueryVariables>(SearchCmsContentQueryDocument, options);
        }
export type SearchCmsContentQueryHookResult = ReturnType<typeof useSearchCmsContentQuery>;
export type SearchCmsContentQueryLazyQueryHookResult = ReturnType<typeof useSearchCmsContentQueryLazyQuery>;
export type SearchCmsContentQueryQueryResult = Apollo.QueryResult<SearchCmsContentQueryData, SearchCmsContentQueryVariables>;