/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TeamMemberTicketFieldsFragment = { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined };

export type TeamMemberUserConProfileFieldsFragment = { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, mobile_phone?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined };

export type TeamMemberUserConProfileSearchFieldsFragment = { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined };

export type TeamMemberFieldsFragment = { __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, mobile_phone?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } };

export type TeamMemberFieldsWithoutPersonalInfoFragment = { __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } };

export type TeamMembersQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID'];
}>;


export type TeamMembersQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_name: string, ticketNamePlural: string, name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_mode: Types.TicketMode, event: { __typename: 'Event', id: string, title?: string | null | undefined, event_category: { __typename: 'EventCategory', id: string, can_provide_tickets: boolean, team_member_name: string, teamMemberNamePlural: string }, provided_tickets: Array<{ __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined }>, team_members: Array<{ __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, mobile_phone?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } }> }, ticket_types: Array<{ __typename: 'TicketType', id: string, name: string, description?: string | null | undefined, maximum_event_provided_tickets: number }>, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined }> } };

export type TeamMemberUserConProfilesQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type TeamMemberUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', entries: Array<{ __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined }> } } };

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
    query TeamMembersQuery($eventId: ID!) {
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
        teamMemberNamePlural
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
      maximum_event_provided_tickets(eventId: $eventId)
    }
    ticket_name
    ticketNamePlural
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