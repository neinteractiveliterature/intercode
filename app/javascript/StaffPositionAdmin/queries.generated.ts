/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PermissionedModelFields_CmsContentGroup_Fragment, PermissionedModelFields_Convention_Fragment, PermissionedModelFields_EventCategory_Fragment, PermissionedRoleFields_OrganizationRole_Fragment, PermissionedRoleFields_StaffPosition_Fragment } from '../Permissions/fragments.generated';
import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
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

export type StaffPositionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type StaffPositionsQueryData = (
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
 * __useStaffPositionsQuery__
 *
 * To run a query within a React component, call `useStaffPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStaffPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStaffPositionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStaffPositionsQuery(baseOptions?: Apollo.QueryHookOptions<StaffPositionsQueryData, StaffPositionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StaffPositionsQueryData, StaffPositionsQueryVariables>(StaffPositionsQueryDocument, options);
      }
export function useStaffPositionsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StaffPositionsQueryData, StaffPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StaffPositionsQueryData, StaffPositionsQueryVariables>(StaffPositionsQueryDocument, options);
        }
export type StaffPositionsQueryHookResult = ReturnType<typeof useStaffPositionsQuery>;
export type StaffPositionsQueryLazyQueryHookResult = ReturnType<typeof useStaffPositionsQueryLazyQuery>;
export type StaffPositionsQueryQueryResult = Apollo.QueryResult<StaffPositionsQueryData, StaffPositionsQueryVariables>;