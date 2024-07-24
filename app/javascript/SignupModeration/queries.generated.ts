/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc, EventPageRunFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import { UserConProfileRankedChoiceQueueFieldsFragmentDoc } from '../EventsApp/MySignupQueue/queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignupModerationRunFieldsFragment = { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number } };

export type SignupModerationSignupRequestFieldsFragment = { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number } } } | null, target_run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null }, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }> }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null } | null };

export type CreateSignupEventsQueryVariables = Types.Exact<{
  title?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateSignupEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', id: string, title?: string | null, length_seconds: number, private_signup_list?: boolean | null, runs: Array<{ __typename: 'Run', id: string, starts_at: string, title_suffix?: string | null, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }> }> }> } } };

export type CreateSignupRunCardQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID']['input'];
  eventId: Types.Scalars['ID']['input'];
}>;


export type CreateSignupRunCardQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_event_signups: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', id: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, private_signup_list?: boolean | null, can_play_concurrently: boolean, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null, total_slots?: number | null }> } | null, team_members: Array<{ __typename: 'TeamMember', id: string, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: string, gravatar_url: string, gravatar_enabled: boolean, name_without_nickname: string } }>, event_category: { __typename: 'EventCategory', id: string, team_member_name: string, teamMemberNamePlural: string }, runs: Array<{ __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, current_ability_can_signup_summary_run: boolean, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, counted: boolean, expires_at?: string | null }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, requested_bucket_key?: string | null, priority: number, target_run: { __typename: 'Run', id: string } }> }>, ticket_types: Array<{ __typename: 'TicketType', id: string, providing_products: Array<{ __typename: 'Product', id: string, description_html?: string | null, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> }> }, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, counted: boolean, run: { __typename: 'Run', id: string } }>, signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, target_run: { __typename: 'Run', id: string } }> } } };

export type SignupModerationQueueQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type SignupModerationQueueQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_requests_paginated: { __typename: 'SignupRequestsPagination', total_pages: number, entries: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, created_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string }, replace_signup?: { __typename: 'Signup', id: string, run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number } } } | null, target_run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, registration_policy?: { __typename: 'RegistrationPolicy', prevent_no_preference_signups: boolean, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, total_slots?: number | null, slots_limited: boolean, anything: boolean, not_counted: boolean }> } | null }, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }> }, result_signup?: { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null } | null }> } } };

export type SignupModerationAttendeeRankedChoicesQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID']['input'];
}>;


export type SignupModerationAttendeeRankedChoicesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, ranked_choice_allow_waitlist: boolean, ranked_choice_user_constraints: Array<{ __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number }>, ticket?: { __typename: 'Ticket', id: string, ticket_type: { __typename: 'TicketType', id: string, allows_event_signups: boolean } } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, counted: boolean, run: { __typename: 'Run', id: string, starts_at: string, ends_at: string } }>, signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, event_category: { __typename: 'EventCategory', id: string, name: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null }> } | null } } }> } } };

export const SignupModerationRunFieldsFragmentDoc = gql`
    fragment SignupModerationRunFields on Run {
  id
  title_suffix
  starts_at
  grouped_signup_counts {
    bucket_key
    count
    counted
    state
    team_member
  }
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
export function useCreateSignupEventsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CreateSignupEventsQueryData, CreateSignupEventsQueryVariables>(CreateSignupEventsQueryDocument, options);
        }
export type CreateSignupEventsQueryHookResult = ReturnType<typeof useCreateSignupEventsQuery>;
export type CreateSignupEventsQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupEventsQueryLazyQuery>;
export type CreateSignupEventsQuerySuspenseQueryHookResult = ReturnType<typeof useCreateSignupEventsQuerySuspenseQuery>;
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
    signup_rounds {
      id
      start
      maximum_event_signups
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
        teamMemberNamePlural
      }
      runs {
        id
        ...EventPageRunFields
      }
      ticket_types {
        id
        providing_products {
          id
          description_html
          name
          available
          pricing_structure {
            ...PricingStructureFields
          }
        }
      }
    }
    user_con_profile(id: $userConProfileId) {
      id
      name_without_nickname
      signups {
        id
        state
        waitlist_position
        counted
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
${EventPageRunFieldsFragmentDoc}
${PricingStructureFieldsFragmentDoc}`;

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
export function useCreateSignupRunCardQuery(baseOptions: Apollo.QueryHookOptions<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables> & ({ variables: CreateSignupRunCardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>(CreateSignupRunCardQueryDocument, options);
      }
export function useCreateSignupRunCardQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>(CreateSignupRunCardQueryDocument, options);
        }
export function useCreateSignupRunCardQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CreateSignupRunCardQueryData, CreateSignupRunCardQueryVariables>(CreateSignupRunCardQueryDocument, options);
        }
export type CreateSignupRunCardQueryHookResult = ReturnType<typeof useCreateSignupRunCardQuery>;
export type CreateSignupRunCardQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupRunCardQueryLazyQuery>;
export type CreateSignupRunCardQuerySuspenseQueryHookResult = ReturnType<typeof useCreateSignupRunCardQuerySuspenseQuery>;
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
export function useSignupModerationQueueQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>(SignupModerationQueueQueryDocument, options);
        }
export type SignupModerationQueueQueryHookResult = ReturnType<typeof useSignupModerationQueueQuery>;
export type SignupModerationQueueQueryLazyQueryHookResult = ReturnType<typeof useSignupModerationQueueQueryLazyQuery>;
export type SignupModerationQueueQuerySuspenseQueryHookResult = ReturnType<typeof useSignupModerationQueueQuerySuspenseQuery>;
export type SignupModerationQueueQueryQueryResult = Apollo.QueryResult<SignupModerationQueueQueryData, SignupModerationQueueQueryVariables>;
export const SignupModerationAttendeeRankedChoicesQueryDocument = gql`
    query SignupModerationAttendeeRankedChoicesQuery($userConProfileId: ID!) {
  convention: conventionByRequestHost {
    id
    user_con_profile(id: $userConProfileId) {
      id
      name_without_nickname
      ...UserConProfileRankedChoiceQueueFields
    }
  }
}
    ${UserConProfileRankedChoiceQueueFieldsFragmentDoc}`;

/**
 * __useSignupModerationAttendeeRankedChoicesQuery__
 *
 * To run a query within a React component, call `useSignupModerationAttendeeRankedChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupModerationAttendeeRankedChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupModerationAttendeeRankedChoicesQuery({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *   },
 * });
 */
export function useSignupModerationAttendeeRankedChoicesQuery(baseOptions: Apollo.QueryHookOptions<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables> & ({ variables: SignupModerationAttendeeRankedChoicesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>(SignupModerationAttendeeRankedChoicesQueryDocument, options);
      }
export function useSignupModerationAttendeeRankedChoicesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>(SignupModerationAttendeeRankedChoicesQueryDocument, options);
        }
export function useSignupModerationAttendeeRankedChoicesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>(SignupModerationAttendeeRankedChoicesQueryDocument, options);
        }
export type SignupModerationAttendeeRankedChoicesQueryHookResult = ReturnType<typeof useSignupModerationAttendeeRankedChoicesQuery>;
export type SignupModerationAttendeeRankedChoicesQueryLazyQueryHookResult = ReturnType<typeof useSignupModerationAttendeeRankedChoicesQueryLazyQuery>;
export type SignupModerationAttendeeRankedChoicesQuerySuspenseQueryHookResult = ReturnType<typeof useSignupModerationAttendeeRankedChoicesQuerySuspenseQuery>;
export type SignupModerationAttendeeRankedChoicesQueryQueryResult = Apollo.QueryResult<SignupModerationAttendeeRankedChoicesQueryData, SignupModerationAttendeeRankedChoicesQueryVariables>;