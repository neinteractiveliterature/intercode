/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc, EventPageRunFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SignupModerationRunFieldsFragment = { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string } };

export type SignupModerationSignupRequestFieldsFragment = { __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: any, id: string, user_con_profile: { __typename: 'UserConProfile', name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string, id: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string } } } | null | undefined, target_run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string } | null | undefined };

export type CreateSignupEventsQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateSignupEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', title?: string | null | undefined, length_seconds: number, private_signup_list?: boolean | null | undefined, id: string, runs: Array<{ __typename: 'Run', starts_at: any, title_suffix?: string | null | undefined, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }> }> }> } } };

export type CreateSignupRunCardQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID'];
  eventId: Types.Scalars['ID'];
}>;


export type CreateSignupRunCardQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_event_signups: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, private_signup_list?: boolean | null | undefined, can_play_concurrently: boolean, id: string, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null | undefined, total_slots?: number | null | undefined }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', display_team_member: boolean, id: string, user_con_profile: { __typename: 'UserConProfile', gravatar_url: string, gravatar_enabled: boolean, name_without_nickname: string, id: string } }>, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, runs: Array<{ __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }> }, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string, signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string, run: { __typename: 'Run', id: string } }>, signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string, target_run: { __typename: 'Run', id: string } }> } } };

export type SignupModerationQueueQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupModerationQueueQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_requests_paginated: { __typename: 'SignupRequestsPagination', total_pages: number, entries: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, created_at: any, id: string, user_con_profile: { __typename: 'UserConProfile', name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string, id: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string } } } | null | undefined, target_run: { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, id: string, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, total_slots?: number | null | undefined, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null | undefined } }, result_signup?: { __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string } | null | undefined }> } } };

export const SignupModerationRunFieldsFragmentDoc = gql`
    fragment SignupModerationRunFields on Run {
  id: transitionalId
  title_suffix
  starts_at
  signup_count_by_state_and_bucket_key_and_counted
  event {
    id: transitionalId
    title
    length_seconds
  }
}
    `;
export const SignupModerationSignupRequestFieldsFragmentDoc = gql`
    fragment SignupModerationSignupRequestFields on SignupRequest {
  id: transitionalId
  state
  requested_bucket_key
  created_at
  user_con_profile {
    id: transitionalId
    name
    name_inverted
    gravatar_enabled
    gravatar_url
  }
  replace_signup {
    id: transitionalId
    run {
      id: transitionalId
      ...SignupModerationRunFields
    }
  }
  target_run {
    id: transitionalId
    ...SignupModerationRunFields
    event {
      id: transitionalId
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
    id: transitionalId
    state
    waitlist_position
  }
}
    ${SignupModerationRunFieldsFragmentDoc}`;
export const CreateSignupEventsQueryDocument = gql`
    query CreateSignupEventsQuery($title: String) {
  convention: conventionByRequestHost {
    id: transitionalId
    events_paginated(filters: {title: $title}, per_page: 50) {
      entries {
        id: transitionalId
        title
        length_seconds
        private_signup_list
        runs {
          id: transitionalId
          starts_at
          title_suffix
          rooms {
            id: transitionalId
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
    can_read_event_signups(transitionalEventId: $eventId)
    can_update_event(transitionalEventId: $eventId)
  }
  convention: conventionByRequestHost {
    id: transitionalId
    event(transitionalId: $eventId) {
      id: transitionalId
      title
      length_seconds
      private_signup_list
      can_play_concurrently
      registration_policy {
        ...RunCardRegistrationPolicyFields
      }
      team_members {
        id: transitionalId
        display_team_member
        user_con_profile {
          id: transitionalId
          gravatar_url
          gravatar_enabled
          name_without_nickname
        }
      }
      event_category {
        id: transitionalId
        team_member_name
      }
      runs {
        id: transitionalId
        ...EventPageRunFields
      }
    }
    user_con_profile(transitionalId: $userConProfileId) {
      id: transitionalId
      name_without_nickname
      signups {
        id: transitionalId
        state
        waitlist_position
        run {
          id: transitionalId
        }
      }
      signup_requests {
        id: transitionalId
        state
        target_run {
          id: transitionalId
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
    id: transitionalId
    signup_requests_paginated(
      sort: [{field: "state", desc: false}, {field: "created_at", desc: false}]
      page: $page
      per_page: $perPage
    ) {
      total_pages
      entries {
        id: transitionalId
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