/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type OrganizationRoleFieldsFragment = { __typename: 'OrganizationRole', id: string, name: string, users: Array<{ __typename: 'User', id: string, name?: string | null | undefined, email?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string }> };

export type OrganizationAdminOrganizationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrganizationAdminOrganizationsQueryData = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', id: string, name: string, current_ability_can_manage_access: boolean, conventions: Array<{ __typename: 'Convention', id: string, name: string, starts_at?: string | null | undefined }>, organization_roles: Array<{ __typename: 'OrganizationRole', id: string, name: string, users: Array<{ __typename: 'User', id: string, name?: string | null | undefined, email?: string | null | undefined }>, permissions: Array<{ __typename: 'Permission', id: string, permission: string }> }> }> };

export const OrganizationRoleFieldsFragmentDoc = gql`
    fragment OrganizationRoleFields on OrganizationRole {
  id
  name
  users {
    id
    name
    email
  }
  permissions {
    id
    permission
  }
}
    `;
export const OrganizationAdminOrganizationsQueryDocument = gql`
    query OrganizationAdminOrganizationsQuery {
  organizations {
    id
    name
    current_ability_can_manage_access
    conventions {
      id
      name
      starts_at
    }
    organization_roles {
      id
      ...OrganizationRoleFields
    }
  }
}
    ${OrganizationRoleFieldsFragmentDoc}`;

/**
 * __useOrganizationAdminOrganizationsQuery__
 *
 * To run a query within a React component, call `useOrganizationAdminOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationAdminOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationAdminOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationAdminOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>(OrganizationAdminOrganizationsQueryDocument, options);
      }
export function useOrganizationAdminOrganizationsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>(OrganizationAdminOrganizationsQueryDocument, options);
        }
export type OrganizationAdminOrganizationsQueryHookResult = ReturnType<typeof useOrganizationAdminOrganizationsQuery>;
export type OrganizationAdminOrganizationsQueryLazyQueryHookResult = ReturnType<typeof useOrganizationAdminOrganizationsQueryLazyQuery>;
export type OrganizationAdminOrganizationsQueryQueryResult = Apollo.QueryResult<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>;