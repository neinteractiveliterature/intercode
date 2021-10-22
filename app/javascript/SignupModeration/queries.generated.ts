/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc, EventPageRunFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SignupModerationRunFieldsFragment = { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number } };

export type SignupModerationSignupRequestFieldsFragment = { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number } } } | null | undefined, target_run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined } | null | undefined };

export type CreateSignupEventsQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateSignupEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, private_signup_list?: boolean | null | undefined, runs: Array<{ __typename: 'Run', id: string, starts_at: string, title_suffix?: string | null | undefined, rooms: Array<{ __typename: 'Room', id: string, name?: string | null | undefined }> }> }> } } };

export type CreateSignupRunCardQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID'];
  eventId: Types.Scalars['ID'];
}>;


export type CreateSignupRunCardQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_event_signups: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', id: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, private_signup_list?: boolean | null | undefined, can_play_concurrently: boolean, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null | undefined, total_slots?: number | null | undefined }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', id: string, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: string, gravatar_url: string, gravatar_enabled: boolean, name_without_nickname: string } }>, event_category: { __typename: 'EventCategory', id: string, team_member_name: string }, runs: Array<{ __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: string, rooms: Array<{ __typename: 'Room', id: string, name?: string | null | undefined }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }> }, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined, run: { __typename: 'Run', id: string } }>, signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, target_run: { __typename: 'Run', id: string } }> } } };

export type SignupModerationQueueQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupModerationQueueQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_requests_paginated: { __typename: 'SignupRequestsPagination', total_pages: number, entries: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number } } } | null | undefined, target_run: { __typename: 'Run', id: string, title_suffix?: string | null | undefined, starts_at: string, signup_count_by_state_and_bucket_key_and_counted: string, event: { __typename: 'Event', id: string, title?: string | null | undefined, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null | undefined } | null | undefined }> } } };

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
  convention: conventionByRequestHost {
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
    query CreateSignupRunCardQuery($userConProfileId: ID!, $eventId: ID!) {
  currentAbility {
    can_read_schedule
    can_read_event_signups(eventId: $eventId)
    can_update_event(eventId: $eventId)
  }
  convention: conventionByRequestHost {
    id
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
    user_con_profile(id: $userConProfileId) {
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
  convention: conventionByRequestHost {
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