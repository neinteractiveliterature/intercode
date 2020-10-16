/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type EventCategoryFieldsFragment = (
  { __typename: 'EventCategory' }
  & Pick<Types.EventCategory, 'id' | 'name' | 'team_member_name' | 'proposal_description' | 'scheduling_ui' | 'default_color' | 'signed_up_color' | 'full_color' | 'can_provide_tickets'>
  & { events_paginated: (
    { __typename: 'EventsPagination' }
    & Pick<Types.EventsPagination, 'total_entries'>
  ), department?: Types.Maybe<(
    { __typename: 'Department' }
    & Pick<Types.Department, 'id' | 'name'>
  )>, event_form: (
    { __typename: 'Form' }
    & Pick<Types.Form, 'id' | 'title' | 'form_type'>
  ), event_proposal_form?: Types.Maybe<(
    { __typename: 'Form' }
    & Pick<Types.Form, 'id' | 'title' | 'form_type'>
  )> }
);

export type EventCategoryAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventCategoryAdminQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'ticket_name' | 'ticket_mode'>
    & { departments: Array<(
      { __typename: 'Department' }
      & Pick<Types.Department, 'id' | 'name'>
    )>, event_categories: Array<(
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & EventCategoryFieldsFragment
    )>, forms: Array<(
      { __typename: 'Form' }
      & Pick<Types.Form, 'id' | 'title' | 'form_type'>
    )> }
  ) }
);

export const EventCategoryFieldsFragmentDoc = gql`
    fragment EventCategoryFields on EventCategory {
  id
  name
  team_member_name
  proposal_description
  scheduling_ui
  default_color
  signed_up_color
  full_color
  can_provide_tickets
  events_paginated {
    total_entries
  }
  department {
    id
    name
  }
  event_form {
    id
    title
    form_type
  }
  event_proposal_form {
    id
    title
    form_type
  }
}
    `;
export const EventCategoryAdminQueryDocument = gql`
    query EventCategoryAdminQuery {
  convention: assertConvention {
    id
    name
    ticket_name
    ticket_mode
    departments {
      id
      name
    }
    event_categories {
      id
      ...EventCategoryFields
    }
    forms {
      id
      title
      form_type
    }
  }
}
    ${EventCategoryFieldsFragmentDoc}`;

/**
 * __useEventCategoryAdminQueryQuery__
 *
 * To run a query within a React component, call `useEventCategoryAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventCategoryAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventCategoryAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventCategoryAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<EventCategoryAdminQueryQuery, EventCategoryAdminQueryQueryVariables>) {
        return Apollo.useQuery<EventCategoryAdminQueryQuery, EventCategoryAdminQueryQueryVariables>(EventCategoryAdminQueryDocument, baseOptions);
      }
export function useEventCategoryAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventCategoryAdminQueryQuery, EventCategoryAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<EventCategoryAdminQueryQuery, EventCategoryAdminQueryQueryVariables>(EventCategoryAdminQueryDocument, baseOptions);
        }
export type EventCategoryAdminQueryQueryHookResult = ReturnType<typeof useEventCategoryAdminQueryQuery>;
export type EventCategoryAdminQueryLazyQueryHookResult = ReturnType<typeof useEventCategoryAdminQueryLazyQuery>;
export type EventCategoryAdminQueryQueryResult = Apollo.QueryResult<EventCategoryAdminQueryQuery, EventCategoryAdminQueryQueryVariables>;