/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
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


export type EventListEventsQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule'>
  ), convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { events_paginated: (
      { __typename: 'EventsPagination' }
      & Pick<Types.EventsPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'created_at' | 'short_blurb_html' | 'form_response_attrs_json' | 'my_rating'>
        & { event_category: (
          { __typename: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'name' | 'team_member_name'>
        ), runs: Array<(
          { __typename: 'Run' }
          & Pick<Types.Run, 'id' | 'starts_at'>
        )>, team_members: Array<(
          { __typename: 'TeamMember' }
          & Pick<Types.TeamMember, 'id' | 'display_team_member'>
          & { user_con_profile: (
            { __typename: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'last_name' | 'name_without_nickname' | 'gravatar_enabled' | 'gravatar_url'>
          ) }
        )> }
      )> }
    ) }
    & CommonConventionDataFragment
  )> }
);


export const EventListEventsQueryDocument = gql`
    query EventListEventsQuery($page: Int, $pageSize: Int, $filters: EventFiltersInput, $sort: [SortInput!]) {
  currentAbility {
    can_read_schedule
  }
  convention {
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