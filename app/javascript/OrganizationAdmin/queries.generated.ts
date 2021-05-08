/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type OrganizationRoleFieldsFragment = (
  { __typename: 'OrganizationRole' }
  & Pick<Types.OrganizationRole, 'id' | 'name'>
  & { users: Array<(
    { __typename: 'User' }
    & Pick<Types.User, 'id' | 'name' | 'email'>
  )>, permissions: Array<(
    { __typename: 'Permission' }
    & Pick<Types.Permission, 'id' | 'permission'>
  )> }
);

export type OrganizationAdminOrganizationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrganizationAdminOrganizationsQueryData = (
  { __typename: 'Query' }
  & { organizations: Array<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'current_ability_can_manage_access'>
    & { conventions: Array<(
      { __typename: 'Convention' }
      & Pick<Types.Convention, 'id' | 'name' | 'starts_at'>
    )>, organization_roles: Array<(
      { __typename: 'OrganizationRole' }
      & Pick<Types.OrganizationRole, 'id'>
      & OrganizationRoleFieldsFragment
    )> }
  )> }
);

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
export type OrganizationAdminOrganizationsQueryDataResult = Apollo.QueryResult<OrganizationAdminOrganizationsQueryData, OrganizationAdminOrganizationsQueryVariables>;
