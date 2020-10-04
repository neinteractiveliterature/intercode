/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PermissionedModelFields_CmsContentGroup_Fragment, PermissionedModelFields_Convention_Fragment, PermissionedModelFields_EventCategory_Fragment, PermissionedRoleFields_OrganizationRole_Fragment, PermissionedRoleFields_StaffPosition_Fragment } from '../Permissions/fragments.generated';
import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
export type StaffPositionFieldsFragment = (
  { __typename: 'StaffPosition' }
  & Pick<Types.StaffPosition, 'id' | 'name' | 'email' | 'visible' | 'email_aliases' | 'cc_addresses'>
  & { user_con_profiles: Array<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'gravatar_url' | 'gravatar_enabled'>
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
    ) }
  )> }
);

export type StaffPositionsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type StaffPositionsQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { event_categories: Array<(
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'name' | 'default_color'>
    )>, cms_content_groups: Array<(
      { __typename: 'CmsContentGroup' }
      & Pick<Types.CmsContentGroup, 'id' | 'name'>
    )>, staff_positions: Array<(
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id'>
      & StaffPositionFieldsFragment
    )> }
  ) }
);

export const StaffPositionFieldsFragmentDoc = gql`
    fragment StaffPositionFields on StaffPosition {
  id
  name
  email
  visible
  email_aliases
  cc_addresses
  user_con_profiles {
    id
    name_without_nickname
    gravatar_url
    gravatar_enabled
  }
  permissions {
    id
    permission
    model {
      ...PermissionedModelFields
    }
  }
}
    ${PermissionedModelFieldsFragmentDoc}`;
export const StaffPositionsQueryDocument = gql`
    query StaffPositionsQuery {
  convention: assertConvention {
    id
    name
    event_categories {
      id
      name
      default_color
    }
    cms_content_groups {
      id
      name
    }
    staff_positions {
      id
      ...StaffPositionFields
    }
  }
}
    ${StaffPositionFieldsFragmentDoc}`;

/**
 * __useStaffPositionsQueryQuery__
 *
 * To run a query within a React component, call `useStaffPositionsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useStaffPositionsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStaffPositionsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useStaffPositionsQueryQuery(baseOptions?: Apollo.QueryHookOptions<StaffPositionsQueryQuery, StaffPositionsQueryQueryVariables>) {
        return Apollo.useQuery<StaffPositionsQueryQuery, StaffPositionsQueryQueryVariables>(StaffPositionsQueryDocument, baseOptions);
      }
export function useStaffPositionsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StaffPositionsQueryQuery, StaffPositionsQueryQueryVariables>) {
          return Apollo.useLazyQuery<StaffPositionsQueryQuery, StaffPositionsQueryQueryVariables>(StaffPositionsQueryDocument, baseOptions);
        }
export type StaffPositionsQueryQueryHookResult = ReturnType<typeof useStaffPositionsQueryQuery>;
export type StaffPositionsQueryLazyQueryHookResult = ReturnType<typeof useStaffPositionsQueryLazyQuery>;
export type StaffPositionsQueryQueryResult = Apollo.QueryResult<StaffPositionsQueryQuery, StaffPositionsQueryQueryVariables>;