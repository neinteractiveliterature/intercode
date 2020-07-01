/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
import gql from 'graphql-tag';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type MySignupFieldsFragment = (
  { __typename?: 'Signup' }
  & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
);

export type MySignupRequestFieldsFragment = (
  { __typename?: 'SignupRequest' }
  & Pick<Types.SignupRequest, 'id' | 'state' | 'requested_bucket_key'>
  & { target_run: (
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id'>
  ), replace_signup?: Types.Maybe<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id'>
  )> }
);

export type EventPageRunFieldsFragment = (
  { __typename?: 'Run' }
  & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at' | 'current_ability_can_signup_summary_run' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { rooms: Array<(
    { __typename?: 'Room' }
    & Pick<Types.Room, 'id' | 'name'>
  )>, my_signups: Array<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & MySignupFieldsFragment
  )>, my_signup_requests: Array<(
    { __typename?: 'SignupRequest' }
    & Pick<Types.SignupRequest, 'id'>
    & MySignupRequestFieldsFragment
  )> }
);

export type RunCardRegistrationPolicyFieldsFragment = (
  { __typename?: 'RegistrationPolicy' }
  & Pick<Types.RegistrationPolicy, 'slots_limited' | 'prevent_no_preference_signups' | 'total_slots_including_not_counted'>
  & { buckets: Array<(
    { __typename?: 'RegistrationPolicyBucket' }
    & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'description' | 'not_counted' | 'slots_limited' | 'anything' | 'minimum_slots' | 'total_slots'>
  )> }
);

export type EventPageEventFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list' | 'my_rating' | 'form_response_attrs_json_with_rendered_markdown' | 'can_play_concurrently'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'team_member_name'>
  ), form?: Types.Maybe<(
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id' | 'form_api_json'>
  )>, team_members: Array<(
    { __typename?: 'TeamMember' }
    & Pick<Types.TeamMember, 'id' | 'email' | 'display_team_member'>
    & { user_con_profile: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'gravatar_enabled' | 'gravatar_url'>
    ) }
  )>, registration_policy?: Types.Maybe<(
    { __typename?: 'RegistrationPolicy' }
    & RunCardRegistrationPolicyFieldsFragment
  )>, runs: Array<(
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id'>
    & EventPageRunFieldsFragment
  )> }
);

export type EventPageQueryQueryVariables = Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type EventPageQueryQuery = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule' | 'can_update_event' | 'can_read_event_signups'>
  ), convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
  )>, event?: Types.Maybe<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id'>
    & EventPageEventFieldsFragment
  )> }
);

export type CreateModeratedSignupModalQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CreateModeratedSignupModalQueryQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { signups: Array<(
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id' | 'state'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id' | 'starts_at'>
        & { event: (
          { __typename?: 'Event' }
          & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'can_play_concurrently'>
        ) }
      ) }
    )> }
  )> }
);

export type EventHistoryQueryQueryVariables = Exact<{
  id: Types.Scalars['Int'];
}>;


export type EventHistoryQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name'>
  )>, event?: Types.Maybe<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & { event_form: (
        { __typename?: 'Form' }
        & Pick<Types.Form, 'id' | 'form_api_json'>
      ) }
    ), form_response_changes: Array<(
      { __typename?: 'FormResponseChange' }
      & Pick<Types.FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value' | 'created_at' | 'updated_at'>
      & { user_con_profile: (
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
      ) }
    )> }
  )> }
);

export const RunCardRegistrationPolicyFieldsFragmentDoc = gql`
    fragment RunCardRegistrationPolicyFields on RegistrationPolicy {
  slots_limited
  prevent_no_preference_signups
  total_slots_including_not_counted
  buckets {
    key
    name
    description
    not_counted
    slots_limited
    anything
    minimum_slots
    total_slots
  }
}
    `;
export const MySignupFieldsFragmentDoc = gql`
    fragment MySignupFields on Signup {
  id
  state
  waitlist_position
}
    `;
export const MySignupRequestFieldsFragmentDoc = gql`
    fragment MySignupRequestFields on SignupRequest {
  id
  state
  target_run {
    id
  }
  requested_bucket_key
  replace_signup {
    id
  }
}
    `;
export const EventPageRunFieldsFragmentDoc = gql`
    fragment EventPageRunFields on Run {
  id
  title_suffix
  starts_at
  current_ability_can_signup_summary_run
  signup_count_by_state_and_bucket_key_and_counted
  rooms {
    id
    name
  }
  my_signups {
    id
    ...MySignupFields
  }
  my_signup_requests {
    id
    ...MySignupRequestFields
  }
}
    ${MySignupFieldsFragmentDoc}
${MySignupRequestFieldsFragmentDoc}`;
export const EventPageEventFieldsFragmentDoc = gql`
    fragment EventPageEventFields on Event {
  id
  title
  length_seconds
  private_signup_list
  my_rating
  form_response_attrs_json_with_rendered_markdown
  can_play_concurrently
  event_category {
    id
    team_member_name
  }
  form {
    id
    form_api_json
  }
  team_members {
    id
    email
    display_team_member
    user_con_profile {
      id
      name_without_nickname
      gravatar_enabled
      gravatar_url
    }
  }
  registration_policy {
    ...RunCardRegistrationPolicyFields
  }
  runs {
    id
    ...EventPageRunFields
  }
}
    ${RunCardRegistrationPolicyFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}`;
export const EventPageQueryDocument = gql`
    query EventPageQuery($eventId: Int!) {
  __typename
  currentAbility {
    can_read_schedule
    can_update_event(event_id: $eventId)
    can_read_event_signups(event_id: $eventId)
  }
  convention {
    id
    ...CommonConventionData
  }
  myProfile {
    id
  }
  event(id: $eventId) {
    id
    ...EventPageEventFields
  }
}
    ${CommonConventionDataFragmentDoc}
${EventPageEventFieldsFragmentDoc}`;

/**
 * __useEventPageQueryQuery__
 *
 * To run a query within a React component, call `useEventPageQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventPageQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventPageQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useEventPageQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventPageQueryQuery, EventPageQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventPageQueryQuery, EventPageQueryQueryVariables>(EventPageQueryDocument, baseOptions);
      }
export function useEventPageQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventPageQueryQuery, EventPageQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventPageQueryQuery, EventPageQueryQueryVariables>(EventPageQueryDocument, baseOptions);
        }
export type EventPageQueryQueryHookResult = ReturnType<typeof useEventPageQueryQuery>;
export type EventPageQueryLazyQueryHookResult = ReturnType<typeof useEventPageQueryLazyQuery>;
export type EventPageQueryQueryResult = ApolloReactCommon.QueryResult<EventPageQueryQuery, EventPageQueryQueryVariables>;
export const CreateModeratedSignupModalQueryDocument = gql`
    query CreateModeratedSignupModalQuery {
  myProfile {
    id
    signups {
      id
      state
      run {
        id
        starts_at
        event {
          id
          title
          length_seconds
          can_play_concurrently
        }
      }
    }
  }
}
    `;

/**
 * __useCreateModeratedSignupModalQueryQuery__
 *
 * To run a query within a React component, call `useCreateModeratedSignupModalQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateModeratedSignupModalQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateModeratedSignupModalQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCreateModeratedSignupModalQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CreateModeratedSignupModalQueryQuery, CreateModeratedSignupModalQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<CreateModeratedSignupModalQueryQuery, CreateModeratedSignupModalQueryQueryVariables>(CreateModeratedSignupModalQueryDocument, baseOptions);
      }
export function useCreateModeratedSignupModalQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CreateModeratedSignupModalQueryQuery, CreateModeratedSignupModalQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CreateModeratedSignupModalQueryQuery, CreateModeratedSignupModalQueryQueryVariables>(CreateModeratedSignupModalQueryDocument, baseOptions);
        }
export type CreateModeratedSignupModalQueryQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQueryQuery>;
export type CreateModeratedSignupModalQueryLazyQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQueryLazyQuery>;
export type CreateModeratedSignupModalQueryQueryResult = ApolloReactCommon.QueryResult<CreateModeratedSignupModalQueryQuery, CreateModeratedSignupModalQueryQueryVariables>;
export const EventHistoryQueryDocument = gql`
    query EventHistoryQuery($id: Int!) {
  convention {
    id
    starts_at
    ends_at
    timezone_name
  }
  event(id: $id) {
    id
    title
    event_category {
      id
      event_form {
        id
        form_api_json
      }
    }
    form_response_changes {
      user_con_profile {
        id
        name_without_nickname
      }
      field_identifier
      previous_value
      new_value
      created_at
      updated_at
    }
  }
}
    `;

/**
 * __useEventHistoryQueryQuery__
 *
 * To run a query within a React component, call `useEventHistoryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventHistoryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventHistoryQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventHistoryQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventHistoryQueryQuery, EventHistoryQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventHistoryQueryQuery, EventHistoryQueryQueryVariables>(EventHistoryQueryDocument, baseOptions);
      }
export function useEventHistoryQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventHistoryQueryQuery, EventHistoryQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventHistoryQueryQuery, EventHistoryQueryQueryVariables>(EventHistoryQueryDocument, baseOptions);
        }
export type EventHistoryQueryQueryHookResult = ReturnType<typeof useEventHistoryQueryQuery>;
export type EventHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventHistoryQueryLazyQuery>;
export type EventHistoryQueryQueryResult = ApolloReactCommon.QueryResult<EventHistoryQueryQuery, EventHistoryQueryQueryVariables>;