/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc, EventPageRunFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SignupModerationRunFieldsFragment = { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number } };

export type SignupModerationSignupRequestFieldsFragment = { __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, created_at: any, user_con_profile: { __typename: 'UserConProfile', id: number, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number, run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number } } }>, target_run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, registration_policy?: Types.Maybe<{ __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: Types.Maybe<string>, total_slots?: Types.Maybe<number>, slots_limited: boolean, anything: boolean, not_counted: boolean }> }> } }, result_signup?: Types.Maybe<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }> };

export type CreateSignupEventsQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateSignupEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, private_signup_list?: Types.Maybe<boolean>, runs: Array<{ __typename: 'Run', id: number, starts_at: any, title_suffix?: Types.Maybe<string>, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }> }> }> } } };

export type CreateSignupRunCardQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  eventId: Types.Scalars['Int'];
}>;


export type CreateSignupRunCardQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_event_signups: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', id: number, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, private_signup_list?: Types.Maybe<boolean>, can_play_concurrently: boolean, registration_policy?: Types.Maybe<{ __typename: 'RegistrationPolicy', slots_limited?: Types.Maybe<boolean>, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: Types.Maybe<number>, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: Types.Maybe<string>, description?: Types.Maybe<string>, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: Types.Maybe<number>, total_slots?: Types.Maybe<number> }> }>, team_members: Array<{ __typename: 'TeamMember', id: number, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: number, gravatar_url: string, gravatar_enabled: boolean, name_without_nickname: string } }>, event_category: { __typename: 'EventCategory', id: number, team_member_name: string }, runs: Array<{ __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> }> }> }, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string, signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number>, run: { __typename: 'Run', id: number } }>, signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, target_run: { __typename: 'Run', id: number } }> } } };

export type SignupModerationQueueQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupModerationQueueQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, signup_requests_paginated: { __typename: 'SignupRequestsPagination', total_pages: number, entries: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, created_at: any, user_con_profile: { __typename: 'UserConProfile', id: number, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number, run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number } } }>, target_run: { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, signup_count_by_state_and_bucket_key_and_counted: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, registration_policy?: Types.Maybe<{ __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: Types.Maybe<string>, total_slots?: Types.Maybe<number>, slots_limited: boolean, anything: boolean, not_counted: boolean }> }> } }, result_signup?: Types.Maybe<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }> }> } } };

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
    query CreateSignupRunCardQuery($userConProfileId: Int!, $eventId: Int!) {
  currentAbility {
    can_read_schedule
    can_read_event_signups(event_id: $eventId)
    can_update_event(event_id: $eventId)
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