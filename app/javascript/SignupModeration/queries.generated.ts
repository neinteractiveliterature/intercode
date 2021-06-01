/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { RunCardRegistrationPolicyFieldsFragment, EventPageRunFieldsFragment } from '../EventsApp/EventPage/queries.generated';
import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc, EventPageRunFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SignupModerationRunFieldsFragment = (
  { __typename: 'Run' }
  & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
  ) }
);

export type SignupModerationSignupRequestFieldsFragment = (
  { __typename: 'SignupRequest' }
  & Pick<Types.SignupRequest, 'id' | 'state' | 'requested_bucket_key' | 'created_at'>
  & { user_con_profile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
  ), replace_signup?: Types.Maybe<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & { run: (
      { __typename: 'Run' }
      & Pick<Types.Run, 'id'>
      & SignupModerationRunFieldsFragment
    ) }
  )>, target_run: (
    { __typename: 'Run' }
    & Pick<Types.Run, 'id'>
    & { event: (
      { __typename: 'Event' }
      & Pick<Types.Event, 'id'>
      & { registration_policy?: Types.Maybe<(
        { __typename: 'RegistrationPolicy' }
        & Pick<Types.RegistrationPolicy, 'prevent_no_preference_signups'>
        & { buckets: Array<(
          { __typename: 'RegistrationPolicyBucket' }
          & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'total_slots' | 'slots_limited' | 'anything' | 'not_counted'>
        )> }
      )> }
    ) }
    & SignupModerationRunFieldsFragment
  ), result_signup?: Types.Maybe<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
  )> }
);

export type CreateSignupEventsQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateSignupEventsQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { events_paginated: (
      { __typename: 'EventsPagination' }
      & { entries: Array<(
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list'>
        & { runs: Array<(
          { __typename: 'Run' }
          & Pick<Types.Run, 'id' | 'starts_at' | 'title_suffix'>
          & { rooms: Array<(
            { __typename: 'Room' }
            & Pick<Types.Room, 'id' | 'name'>
          )> }
        )> }
      )> }
    ) }
  )> }
);

export type CreateSignupRunCardQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  eventId: Types.Scalars['Int'];
}>;


export type CreateSignupRunCardQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule' | 'can_read_event_signups' | 'can_update_event'>
  ), event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list' | 'can_play_concurrently'>
    & { registration_policy?: Types.Maybe<(
      { __typename: 'RegistrationPolicy' }
      & RunCardRegistrationPolicyFieldsFragment
    )>, team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id' | 'display_team_member'>
      & { user_con_profile: (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'gravatar_url' | 'gravatar_enabled' | 'name_without_nickname'>
      ) }
    )>, event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), runs: Array<(
      { __typename: 'Run' }
      & Pick<Types.Run, 'id'>
      & EventPageRunFieldsFragment
    )> }
  ), userConProfile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    & { signups: Array<(
      { __typename: 'Signup' }
      & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
      & { run: (
        { __typename: 'Run' }
        & Pick<Types.Run, 'id'>
      ) }
    )>, signup_requests: Array<(
      { __typename: 'SignupRequest' }
      & Pick<Types.SignupRequest, 'id' | 'state'>
      & { target_run: (
        { __typename: 'Run' }
        & Pick<Types.Run, 'id'>
      ) }
    )> }
  ) }
);

export type SignupModerationQueueQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupModerationQueueQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { signup_requests_paginated: (
      { __typename: 'SignupRequestsPagination' }
      & Pick<Types.SignupRequestsPagination, 'total_pages'>
      & { entries: Array<(
        { __typename: 'SignupRequest' }
        & Pick<Types.SignupRequest, 'id'>
        & SignupModerationSignupRequestFieldsFragment
      )> }
    ) }
  ) }
);

export const SignupModerationRunFieldsFragmentDoc = gql`
    fragment SignupModerationRunFields on Run {
  id
  title_suffix
  starts_at
  signup_count_by_state_and_bucket_key_and_counted
  event {
    id
    title
    length_seconds
  }
}
    `;
export const SignupModerationSignupRequestFieldsFragmentDoc = gql`
    fragment SignupModerationSignupRequestFields on SignupRequest {
  id
  state
  requested_bucket_key
  created_at
  user_con_profile {
    id
    name
    name_inverted
    gravatar_enabled
    gravatar_url
  }
  replace_signup {
    id
    run {
      id
      ...SignupModerationRunFields
    }
  }
  target_run {
    id
    ...SignupModerationRunFields
    event {
      id
      registration_policy {
        buckets {
          key
          name
          total_slots
          slots_limited
          anything
          not_counted
        }
        prevent_no_preference_signups
      }
    }
  }
  result_signup {
    id
    state
    waitlist_position
  }
}
    ${SignupModerationRunFieldsFragmentDoc}`;
export const CreateSignupEventsQueryDocument = gql`
    query CreateSignupEventsQuery($title: String) {
  convention {
    id
    events_paginated(filters: {title: $title}, per_page: 50) {
      entries {
        id
        title
        length_seconds
        private_signup_list
        runs {
          id
          starts_at
          title_suffix
          rooms {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCreateSignupEventsQuery__
 *
 * To run a query within a React component, call `useCreateSignupEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateSignupEventsQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateSignupEventsQuery(baseOptions?: Apollo.QueryHookOptions<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>(CreateSignupEventsQueryDocument, options);
      }
export function useCreateSignupEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>(CreateSignupEventsQueryDocument, options);
        }
export type CreateSignupEventsQueryHookResult = ReturnType<typeof useCreateSignupEventsQuery>;
export type CreateSignupEventsQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupEventsQueryLazyQuery>;
export type CreateSignupEventsQueryQueryResult = Apollo.QueryResult<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>;
export const CreateSignupRunCardQueryDocument = gql`
    query CreateSignupRunCardQuery($userConProfileId: Int!, $eventId: Int!) {
  currentAbility {
    can_read_schedule
    can_read_event_signups(event_id: $eventId)
    can_update_event(event_id: $eventId)
  }
  event(id: $eventId) {
    id
    title
    length_seconds
    private_signup_list
    can_play_concurrently
    registration_policy {
      ...RunCardRegistrationPolicyFields
    }
    team_members {
      id
      display_team_member
      user_con_profile {
        id
        gravatar_url
        gravatar_enabled
        name_without_nickname
      }
    }
    event_category {
      id
      team_member_name
    }
    runs {
      id
      ...EventPageRunFields
    }
  }
  userConProfile(id: $userConProfileId) {
    id
    name_without_nickname
    signups {
      id
      state
      waitlist_position
      run {
        id
      }
    }
    signup_requests {
      id
      state
      target_run {
        id
      }
    }
  }
}
    ${RunCardRegistrationPolicyFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}`;

/**
 * __useCreateSignupRunCardQuery__
 *
 * To run a query within a React component, call `useCreateSignupRunCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupRunCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateSignupRunCardQuery({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useCreateSignupRunCardQuery(baseOptions: Apollo.QueryHookOptions<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>(CreateSignupRunCardQueryDocument, options);
      }
export function useCreateSignupRunCardQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>(CreateSignupRunCardQueryDocument, options);
        }
export type CreateSignupRunCardQueryHookResult = ReturnType<typeof useCreateSignupRunCardQuery>;
export type CreateSignupRunCardQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupRunCardQueryLazyQuery>;
export type CreateSignupRunCardQueryQueryResult = Apollo.QueryResult<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>;
export const SignupModerationQueueQueryDocument = gql`
    query SignupModerationQueueQuery($page: Int, $perPage: Int) {
  convention: assertConvention {
    id
    signup_requests_paginated(
      sort: [{field: "state", desc: false}, {field: "created_at", desc: false}]
      page: $page
      per_page: $perPage
    ) {
      total_pages
      entries {
        id
        ...SignupModerationSignupRequestFields
      }
    }
  }
}
    ${SignupModerationSignupRequestFieldsFragmentDoc}`;

/**
 * __useSignupModerationQueueQuery__
 *
 * To run a query within a React component, call `useSignupModerationQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupModerationQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupModerationQueueQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useSignupModerationQueueQuery(baseOptions?: Apollo.QueryHookOptions<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>(SignupModerationQueueQueryDocument, options);
      }
export function useSignupModerationQueueQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>(SignupModerationQueueQueryDocument, options);
        }
export type SignupModerationQueueQueryHookResult = ReturnType<typeof useSignupModerationQueueQuery>;
export type SignupModerationQueueQueryLazyQueryHookResult = ReturnType<typeof useSignupModerationQueueQueryLazyQuery>;
export type SignupModerationQueueQueryQueryResult = Apollo.QueryResult<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>;