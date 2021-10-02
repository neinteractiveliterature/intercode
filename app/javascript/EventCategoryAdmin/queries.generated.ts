/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventCategoryFieldsFragment = { __typename: 'EventCategory', id: number, name: string, team_member_name: string, proposal_description?: string | null | undefined, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, signed_up_color?: string | null | undefined, full_color?: string | null | undefined, can_provide_tickets: boolean, events_paginated: { __typename: 'EventsPagination', total_entries: number }, department?: { __typename: 'Department', id: number, name: string } | null | undefined, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType }, event_proposal_form?: { __typename: 'Form', id: number, title: string, form_type: Types.FormType } | null | undefined };

export type EventCategoryAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventCategoryAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, ticket_name: string, ticket_mode: Types.TicketMode, departments: Array<{ __typename: 'Department', id: number, name: string }>, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, team_member_name: string, proposal_description?: string | null | undefined, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, signed_up_color?: string | null | undefined, full_color?: string | null | undefined, can_provide_tickets: boolean, events_paginated: { __typename: 'EventsPagination', total_entries: number }, department?: { __typename: 'Department', id: number, name: string } | null | undefined, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType }, event_proposal_form?: { __typename: 'Form', id: number, title: string, form_type: Types.FormType } | null | undefined }>, forms: Array<{ __typename: 'Form', id: number, title: string, form_type: Types.FormType }> } };

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
  convention: conventionByRequestHost {
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
export type EventCategoryAdminQueryQueryResult = Apollo.QueryResult<EventCategoryAdminQueryData, EventCategoryAdminQueryVariables>;