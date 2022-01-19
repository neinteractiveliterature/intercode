/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CmsContentFields_CmsLayout_Fragment = { __typename: 'CmsLayout', id: string, name?: string | null | undefined };

export type CmsContentFields_CmsPartial_Fragment = { __typename: 'CmsPartial', id: string, name?: string | null | undefined };

export type CmsContentFields_Page_Fragment = { __typename: 'Page', id: string, name?: string | null | undefined };

export type CmsContentFieldsFragment = CmsContentFields_CmsLayout_Fragment | CmsContentFields_CmsPartial_Fragment | CmsContentFields_Page_Fragment;

export type CmsContentGroupFieldsFragment = { __typename: 'CmsContentGroup', id: string, name: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, contents: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined } | { __typename: 'CmsPartial', id: string, name?: string | null | undefined } | { __typename: 'Page', id: string, name?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model: { __typename: 'CmsContentGroup', id: string, name: string } | { __typename: 'Convention', id: string, name: string } | { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }, role: { __typename: 'OrganizationRole', id: string, name: string } | { __typename: 'StaffPosition', id: string, name: string } }> };

export type CmsContentGroupsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsContentGroupsAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: string, name: string, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }> } | null | undefined, cmsParent: { __typename: 'Convention', id: string, cmsContentGroups: Array<{ __typename: 'CmsContentGroup', id: string, name: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, contents: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined } | { __typename: 'CmsPartial', id: string, name?: string | null | undefined } | { __typename: 'Page', id: string, name?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model: { __typename: 'CmsContentGroup', id: string, name: string } | { __typename: 'Convention', id: string, name: string } | { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }, role: { __typename: 'OrganizationRole', id: string, name: string } | { __typename: 'StaffPosition', id: string, name: string } }> }> } | { __typename: 'RootSite', id: string, cmsContentGroups: Array<{ __typename: 'CmsContentGroup', id: string, name: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, contents: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined } | { __typename: 'CmsPartial', id: string, name?: string | null | undefined } | { __typename: 'Page', id: string, name?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model: { __typename: 'CmsContentGroup', id: string, name: string } | { __typename: 'Convention', id: string, name: string } | { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }, role: { __typename: 'OrganizationRole', id: string, name: string } | { __typename: 'StaffPosition', id: string, name: string } }> }> }, currentAbility: { __typename: 'Ability', can_create_cms_content_groups: boolean } };

export type SearchCmsContentQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type SearchCmsContentQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, typeaheadSearchCmsContent: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined } | { __typename: 'CmsPartial', id: string, name?: string | null | undefined } | { __typename: 'Page', id: string, name?: string | null | undefined }> } | { __typename: 'RootSite', id: string, typeaheadSearchCmsContent: Array<{ __typename: 'CmsLayout', id: string, name?: string | null | undefined } | { __typename: 'CmsPartial', id: string, name?: string | null | undefined } | { __typename: 'Page', id: string, name?: string | null | undefined }> } };

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
  convention: conventionByRequestHostIfPresent {
    id
    name
    staff_positions {
      id
      name
    }
  }
  cmsParent: cmsParentByRequestHost {
    id
    cmsContentGroups {
      id
      ...CmsContentGroupFields
    }
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
  cmsParent: cmsParentByRequestHost {
    id
    typeaheadSearchCmsContent(name: $name) {
      ...CmsContentFields
    }
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