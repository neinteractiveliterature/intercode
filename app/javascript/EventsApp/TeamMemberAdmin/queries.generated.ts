/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TeamMemberTicketFieldsFragment = { __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> };

export type TeamMemberUserConProfileFieldsFragment = { __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, mobile_phone?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> };

export type TeamMemberUserConProfileSearchFieldsFragment = { __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> };

export type TeamMemberFieldsFragment = { __typename: 'TeamMember', id: number, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, mobile_phone?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> } };

export type TeamMemberFieldsWithoutPersonalInfoFragment = { __typename: 'TeamMember', id: number, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> } };

export type TeamMembersQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type TeamMembersQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, ticket_name: string, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, site_mode: Types.SiteMode, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, ticket_mode: Types.TicketMode, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, event_category: { __typename: 'EventCategory', id: number, can_provide_tickets: boolean, team_member_name: string }, provided_tickets: Array<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }>, team_members: Array<{ __typename: 'TeamMember', id: number, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, mobile_phone?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> } }> }, ticket_types: Array<{ __typename: 'TicketType', id: number, name: string, description?: Types.Maybe<string>, maximum_event_provided_tickets: number }>, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: Types.Maybe<string>, full_color?: Types.Maybe<string>, signed_up_color?: Types.Maybe<string> }> } };

export type TeamMemberUserConProfilesQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type TeamMemberUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', entries: Array<{ __typename: 'UserConProfile', id: number, name_without_nickname: string, name_inverted: string, email?: Types.Maybe<string>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, user_con_profile: { __typename: 'UserConProfile', id: number }, ticket_type: { __typename: 'TicketType', id: number, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> }> } } };

export const TeamMemberTicketFieldsFragmentDoc = gql`
    fragment TeamMemberTicketFields on Ticket {
  id
  user_con_profile {
    id
  }
  ticket_type {
    id
    name
  }
  provided_by_event {
    id
    title
  }
}
    `;
export const TeamMemberUserConProfileFieldsFragmentDoc = gql`
    fragment TeamMemberUserConProfileFields on UserConProfile {
  id
  name_without_nickname
  name_inverted
  email
  mobile_phone
  ticket {
    id
    ...TeamMemberTicketFields
  }
}
    ${TeamMemberTicketFieldsFragmentDoc}`;
export const TeamMemberFieldsFragmentDoc = gql`
    fragment TeamMemberFields on TeamMember {
  id
  display_team_member
  show_email
  receive_con_email
  receive_signup_email
  user_con_profile {
    id
    ...TeamMemberUserConProfileFields
  }
}
    ${TeamMemberUserConProfileFieldsFragmentDoc}`;
export const TeamMemberUserConProfileSearchFieldsFragmentDoc = gql`
    fragment TeamMemberUserConProfileSearchFields on UserConProfile {
  id
  name_without_nickname
  name_inverted
  email
  ticket {
    id
    ...TeamMemberTicketFields
  }
}
    ${TeamMemberTicketFieldsFragmentDoc}`;
export const TeamMemberFieldsWithoutPersonalInfoFragmentDoc = gql`
    fragment TeamMemberFieldsWithoutPersonalInfo on TeamMember {
  id
  display_team_member
  show_email
  receive_con_email
  receive_signup_email
  user_con_profile {
    id
    ...TeamMemberUserConProfileSearchFields
  }
}
    ${TeamMemberUserConProfileSearchFieldsFragmentDoc}`;
export const TeamMembersQueryDocument = gql`
    query TeamMembersQuery($eventId: Int!) {
  convention: conventionByRequestHost {
    id
    ...CommonConventionData
    event(id: $eventId) {
      id
      title
      event_category {
        id
        can_provide_tickets
        team_member_name
      }
      provided_tickets {
        id
        ...TeamMemberTicketFields
      }
      team_members {
        id
        ...TeamMemberFields
      }
    }
    ticket_types {
      id
      name
      description
      maximum_event_provided_tickets(event_id: $eventId)
    }
    ticket_name
  }
}
    ${CommonConventionDataFragmentDoc}
${TeamMemberTicketFieldsFragmentDoc}
${TeamMemberFieldsFragmentDoc}`;

/**
 * __useTeamMembersQuery__
 *
 * To run a query within a React component, call `useTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useTeamMembersQuery(baseOptions: Apollo.QueryHookOptions<TeamMembersQueryData, TeamMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamMembersQueryData, TeamMembersQueryVariables>(TeamMembersQueryDocument, options);
      }
export function useTeamMembersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamMembersQueryData, TeamMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamMembersQueryData, TeamMembersQueryVariables>(TeamMembersQueryDocument, options);
        }
export type TeamMembersQueryHookResult = ReturnType<typeof useTeamMembersQuery>;
export type TeamMembersQueryLazyQueryHookResult = ReturnType<typeof useTeamMembersQueryLazyQuery>;
export type TeamMembersQueryQueryResult = Apollo.QueryResult<TeamMembersQueryData, TeamMembersQueryVariables>;
export const TeamMemberUserConProfilesQueryDocument = gql`
    query TeamMemberUserConProfilesQuery($name: String) {
  convention: conventionByRequestHost {
    id
    user_con_profiles_paginated(filters: {name: $name}, per_page: 50) {
      entries {
        id
        ...TeamMemberUserConProfileSearchFields
      }
    }
  }
}
    ${TeamMemberUserConProfileSearchFieldsFragmentDoc}`;

/**
 * __useTeamMemberUserConProfilesQuery__
 *
 * To run a query within a React component, call `useTeamMemberUserConProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMemberUserConProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMemberUserConProfilesQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useTeamMemberUserConProfilesQuery(baseOptions?: Apollo.QueryHookOptions<TeamMemberUserConProfilesQueryData, TeamMemberUserConProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamMemberUserConProfilesQueryData, TeamMemberUserConProfilesQueryVariables>(TeamMemberUserConProfilesQueryDocument, options);
      }
export function useTeamMemberUserConProfilesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamMemberUserConProfilesQueryData, TeamMemberUserConProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamMemberUserConProfilesQueryData, TeamMemberUserConProfilesQueryVariables>(TeamMemberUserConProfilesQueryDocument, options);
        }
export type TeamMemberUserConProfilesQueryHookResult = ReturnType<typeof useTeamMemberUserConProfilesQuery>;
export type TeamMemberUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useTeamMemberUserConProfilesQueryLazyQuery>;
export type TeamMemberUserConProfilesQueryQueryResult = Apollo.QueryResult<TeamMemberUserConProfilesQueryData, TeamMemberUserConProfilesQueryVariables>;