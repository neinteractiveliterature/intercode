/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PermissionedModelFieldsFragmentDoc, PermissionedRoleFieldsFragmentDoc } from '../Permissions/fragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StaffPositionFieldsFragment = { __typename: 'StaffPosition', name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, id: string, user_con_profiles: Array<{ __typename: 'UserConProfile', name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean, id: string }>, permissions: Array<{ __typename: 'Permission', permission: string, id: string, model: { __typename: 'CmsContentGroup', name: string, id: string } | { __typename: 'Convention', name: string, id: string } | { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, role: { __typename: 'OrganizationRole', name: string, id: string } | { __typename: 'StaffPosition', name: string, id: string } }> };

export type StaffPositionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type StaffPositionsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }>, cmsContentGroups: Array<{ __typename: 'CmsContentGroup', name: string, id: string }>, staff_positions: Array<{ __typename: 'StaffPosition', name: string, email?: string | null | undefined, visible?: boolean | null | undefined, email_aliases: Array<string>, cc_addresses: Array<string>, id: string, user_con_profiles: Array<{ __typename: 'UserConProfile', name_without_nickname: string, gravatar_url: string, gravatar_enabled: boolean, id: string }>, permissions: Array<{ __typename: 'Permission', permission: string, id: string, model: { __typename: 'CmsContentGroup', name: string, id: string } | { __typename: 'Convention', name: string, id: string } | { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, role: { __typename: 'OrganizationRole', name: string, id: string } | { __typename: 'StaffPosition', name: string, id: string } }> }> } };

export const StaffPositionFieldsFragmentDoc = gql`
    fragment StaffPositionFields on StaffPosition {
  id: transitionalId
  name
  email
  visible
  email_aliases
  cc_addresses
  user_con_profiles {
    id: transitionalId
    name_without_nickname
    gravatar_url
    gravatar_enabled
  }
  permissions {
    id: transitionalId
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
    id: transitionalId
    name
    event_categories {
      id: transitionalId
      name
      default_color
    }
    cmsContentGroups {
      id: transitionalId
      name
    }
    staff_positions {
      id: transitionalId
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