/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminDepartmentFieldsFragment = { __typename: 'Department', id: number, name: string, proposal_description?: string | null | undefined, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }> };

export type DepartmentAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DepartmentAdminQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_update_departments: boolean }, convention: { __typename: 'Convention', id: number, departments: Array<{ __typename: 'Department', id: number, name: string, proposal_description?: string | null | undefined, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }> }> } };

export const AdminDepartmentFieldsFragmentDoc = gql`
    fragment AdminDepartmentFields on Department {
  id
  name
  proposal_description
  event_categories {
    id
    name
  }
}
    `;
export const DepartmentAdminQueryDocument = gql`
    query DepartmentAdminQuery {
  currentAbility {
    can_update_departments
  }
  convention: conventionByRequestHost {
    id
    departments {
      id
      ...AdminDepartmentFields
    }
  }
}
    ${AdminDepartmentFieldsFragmentDoc}`;

/**
 * __useDepartmentAdminQuery__
 *
 * To run a query within a React component, call `useDepartmentAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepartmentAdminQuery(baseOptions?: Apollo.QueryHookOptions<DepartmentAdminQueryData, DepartmentAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DepartmentAdminQueryData, DepartmentAdminQueryVariables>(DepartmentAdminQueryDocument, options);
      }
export function useDepartmentAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentAdminQueryData, DepartmentAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DepartmentAdminQueryData, DepartmentAdminQueryVariables>(DepartmentAdminQueryDocument, options);
        }
export type DepartmentAdminQueryHookResult = ReturnType<typeof useDepartmentAdminQuery>;
export type DepartmentAdminQueryLazyQueryHookResult = ReturnType<typeof useDepartmentAdminQueryLazyQuery>;
export type DepartmentAdminQueryQueryResult = Apollo.QueryResult<DepartmentAdminQueryData, DepartmentAdminQueryVariables>;