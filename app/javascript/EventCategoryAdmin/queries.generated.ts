/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
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

export type EventCategoryAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventCategoryAdminQueryData = (
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
 * __useEventCategoryAdminQuery__
 *
 * To run a query within a React component, call `useEventCategoryAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventCategoryAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventCategoryAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventCategoryAdminQuery(baseOptions?: Apollo.QueryHookOptions<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>(EventCategoryAdminQueryDocument, options);
      }
export function useEventCategoryAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>(EventCategoryAdminQueryDocument, options);
        }
export type EventCategoryAdminQueryHookResult = ReturnType<typeof useEventCategoryAdminQuery>;
export type EventCategoryAdminQueryLazyQueryHookResult = ReturnType<typeof useEventCategoryAdminQueryLazyQuery>;
export type EventCategoryAdminQueryDataResult = Apollo.QueryResult<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>;
