/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StaffPositionFieldsFragment = { __typename: 'StaffPosition', id: string, name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, user_con_profiles: Array<{ __typename: 'UserConProfile', id: string, name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model: { __typename: 'CmsContentGroup', id: string, name: string } | { __typename: 'Convention', id: string, name: string } | { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }, role: { __typename: 'OrganizationRole', id: string, name: string } | { __typename: 'StaffPosition', id: string, name: string } }> };

export type StaffPositionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type StaffPositionsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }>, cmsContentGroups: Array<{ __typename: 'CmsContentGroup', id: string, name: string }>, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, user_con_profiles: Array<{ __typename: 'UserConProfile', id: string, name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string, model: { __typename: 'CmsContentGroup', id: string, name: string } | { __typename: 'Convention', id: string, name: string } | { __typename: 'EventCategory', id: string, name: string, default_color?: string | null | undefined }, role: { __typename: 'OrganizationRole', id: string, name: string } | { __typename: 'StaffPosition', id: string, name: string } }> }> } };

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
    role {
      ...PermissionedRoleFields
    }
  }
}
    ${PermissionedModelFieldsFragmentDoc}
${PermissionedRoleFieldsFragmentDoc}`;
export const StaffPositionsQueryDocument = gql`
    query StaffPositionsQuery {
  convention: conventionByRequestHost {
    id
    name
    event_categories {
      id
      name
      default_color
    }
    cmsContentGroups {
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