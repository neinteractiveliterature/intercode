/* eslint-disable */
import * as Types from '../../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EventListEventsQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.EventFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
  fetchFormItemIdentifiers?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type EventListEventsQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean }, convention: { __typename: 'Convention', id: string, timezone_mode: Types.TimezoneMode, events_paginated: { __typename: 'EventsPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'Event', id: string, title?: string | null, created_at?: string | null, short_blurb_html?: string | null, form_response_attrs_json_with_rendered_markdown?: string | null, my_rating?: number | null, length_seconds: number, event_category: { __typename: 'EventCategory', id: string }, runs: Array<{ __typename: 'Run', id: string, starts_at: string }>, team_members: Array<{ __typename: 'TeamMember', id: string, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: string, last_name: string, name_without_nickname: string, gravatar_enabled: boolean, gravatar_url: string } }>, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, total_slots?: number | null, minimum_slots?: number | null } | null }> } } };


export const EventListEventsQueryDocument = gql`
    query EventListEventsQuery($page: Int, $pageSize: Int, $filters: EventFiltersInput, $sort: [SortInput!], $fetchFormItemIdentifiers: [String!]) {
  currentAbility {
    can_read_schedule
  }
  convention: conventionByRequestHost {
    id
    timezone_mode
    events_paginated(
      page: $page
      per_page: $pageSize
      filters: $filters
      sort: $sort
    ) {
      total_entries
      total_pages
      current_page
      per_page
      entries {
        id
        title
        created_at
        short_blurb_html
        form_response_attrs_json_with_rendered_markdown(
          itemIdentifiers: $fetchFormItemIdentifiers
        )
        my_rating
        length_seconds
        event_category {
          id
        }
        runs {
          id
          starts_at
        }
        team_members {
          id
          display_team_member
          user_con_profile {
            id
            last_name
            name_without_nickname
            gravatar_enabled
            gravatar_url
          }
        }
        registration_policy {
          slots_limited
          total_slots
          minimum_slots
        }
      }
    }
  }
}
    `;

/**
 * __useEventListEventsQuery__
 *
 * To run a query within a React component, call `useEventListEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventListEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventListEventsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *      fetchFormItemIdentifiers: // value for 'fetchFormItemIdentifiers'
 *   },
 * });
 */
export function useEventListEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventListEventsQueryData, EventListEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventListEventsQueryData, EventListEventsQueryVariables>(EventListEventsQueryDocument, options);
      }
export function useEventListEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventListEventsQueryData, EventListEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventListEventsQueryData, EventListEventsQueryVariables>(EventListEventsQueryDocument, options);
        }
export function useEventListEventsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventListEventsQueryData, EventListEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventListEventsQueryData, EventListEventsQueryVariables>(EventListEventsQueryDocument, options);
        }
export type EventListEventsQueryHookResult = ReturnType<typeof useEventListEventsQuery>;
export type EventListEventsQueryLazyQueryHookResult = ReturnType<typeof useEventListEventsQueryLazyQuery>;
export type EventListEventsQuerySuspenseQueryHookResult = ReturnType<typeof useEventListEventsQuerySuspenseQuery>;
export type EventListEventsQueryQueryResult = Apollo.QueryResult<EventListEventsQueryData, EventListEventsQueryVariables>;