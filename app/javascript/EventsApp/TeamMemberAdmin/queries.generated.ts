/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TeamMemberTicketFieldsFragment = (
  { __typename: 'Ticket' }
  & Pick<Types.Ticket, 'id'>
  & { user_con_profile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
  ), ticket_type: (
    { __typename: 'TicketType' }
    & Pick<Types.TicketType, 'id' | 'name'>
  ), provided_by_event?: Types.Maybe<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
  )> }
);

export type TeamMemberUserConProfileFieldsFragment = (
  { __typename: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'name_inverted' | 'email' | 'mobile_phone'>
  & { ticket?: Types.Maybe<(
    { __typename: 'Ticket' }
    & Pick<Types.Ticket, 'id'>
    & TeamMemberTicketFieldsFragment
  )> }
);

export type TeamMemberUserConProfileSearchFieldsFragment = (
  { __typename: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'name_inverted' | 'email'>
  & { ticket?: Types.Maybe<(
    { __typename: 'Ticket' }
    & Pick<Types.Ticket, 'id'>
    & TeamMemberTicketFieldsFragment
  )> }
);

export type TeamMemberFieldsFragment = (
  { __typename: 'TeamMember' }
  & Pick<Types.TeamMember, 'id' | 'display_team_member' | 'show_email' | 'receive_con_email' | 'receive_signup_email'>
  & { user_con_profile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & TeamMemberUserConProfileFieldsFragment
  ) }
);

export type TeamMemberFieldsWithoutPersonalInfoFragment = (
  { __typename: 'TeamMember' }
  & Pick<Types.TeamMember, 'id' | 'display_team_member' | 'show_email' | 'receive_con_email' | 'receive_signup_email'>
  & { user_con_profile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & TeamMemberUserConProfileSearchFieldsFragment
  ) }
);

export type TeamMembersQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type TeamMembersQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'name' | 'description' | 'maximum_event_provided_tickets'>
    )> }
    & CommonConventionDataFragment
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'can_provide_tickets' | 'team_member_name'>
    ), provided_tickets: Array<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & TeamMemberTicketFieldsFragment
    )>, team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & TeamMemberFieldsFragment
    )> }
  ) }
);

export type TeamMemberUserConProfilesQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type TeamMemberUserConProfilesQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { user_con_profiles_paginated: (
      { __typename: 'UserConProfilesPagination' }
      & { entries: Array<(
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
        & TeamMemberUserConProfileSearchFieldsFragment
      )> }
    ) }
  )> }
);

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
  convention {
    id
    ...CommonConventionData
    ticket_types {
      id
      name
      description
      maximum_event_provided_tickets(event_id: $eventId)
    }
    ticket_name
  }
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
  convention {
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