/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventListEventsQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  pageSize?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EventFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type EventListEventsQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean }, convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, events_paginated: { __typename: 'EventsPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'Event', id: string, title?: string | null | undefined, created_at?: string | null | undefined, short_blurb_html?: string | null | undefined, form_response_attrs_json?: string | null | undefined, my_rating?: number | null | undefined, event_category: { __typename: 'EventCategory', id: string, name: string, team_member_name: string }, runs: Array<{ __typename: 'Run', id: string, starts_at: string }>, team_members: Array<{ __typename: 'TeamMember', id: string, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: string, last_name: string, name_without_nickname: string, gravatar_enabled: boolean, gravatar_url: string } }> }> }, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined }> } };


export const EventListEventsQueryDocument = gql`
    query EventListEventsQuery($page: Int, $pageSize: Int, $filters: EventFiltersInput, $sort: [SortInput!]) {
  currentAbility {
    can_read_schedule
  }
  convention: conventionByRequestHost {
    id
    ...CommonConventionData
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
        form_response_attrs_json
        my_rating
        event_category {
          id
          name
          team_member_name
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
      }
    }
  }
}
    ${CommonConventionDataFragmentDoc}`;

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
export type EventListEventsQueryHookResult = ReturnType<typeof useEventListEventsQuery>;
export type EventListEventsQueryLazyQueryHookResult = ReturnType<typeof useEventListEventsQueryLazyQuery>;
export type EventListEventsQueryQueryResult = Apollo.QueryResult<EventListEventsQueryData, EventListEventsQueryVariables>;