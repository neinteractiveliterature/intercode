/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AdminDepartmentFieldsFragment = (
  { __typename?: 'Department' }
  & Pick<Types.Department, 'id' | 'name' | 'proposal_description'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
  )> }
);

export type DepartmentAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DepartmentAdminQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_update_departments'>
  ), convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { departments: Array<(
      { __typename?: 'Department' }
      & Pick<Types.Department, 'id'>
      & AdminDepartmentFieldsFragment
    )> }
  )> }
);

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
  convention {
    id
    departments {
      id
      ...AdminDepartmentFields
    }
  }
}
    ${AdminDepartmentFieldsFragmentDoc}`;

/**
 * __useDepartmentAdminQueryQuery__
 *
 * To run a query within a React component, call `useDepartmentAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepartmentAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<DepartmentAdminQueryQuery, DepartmentAdminQueryQueryVariables>) {
        return Apollo.useQuery<DepartmentAdminQueryQuery, DepartmentAdminQueryQueryVariables>(DepartmentAdminQueryDocument, baseOptions);
      }
export function useDepartmentAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentAdminQueryQuery, DepartmentAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<DepartmentAdminQueryQuery, DepartmentAdminQueryQueryVariables>(DepartmentAdminQueryDocument, baseOptions);
        }
export type DepartmentAdminQueryQueryHookResult = ReturnType<typeof useDepartmentAdminQueryQuery>;
export type DepartmentAdminQueryLazyQueryHookResult = ReturnType<typeof useDepartmentAdminQueryLazyQuery>;
export type DepartmentAdminQueryQueryResult = Apollo.QueryResult<DepartmentAdminQueryQuery, DepartmentAdminQueryQueryVariables>;