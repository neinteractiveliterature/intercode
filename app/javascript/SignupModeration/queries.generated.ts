/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { RunCardRegistrationPolicyFieldsFragment } from '../EventsApp/EventPage/queries.generated';
import { gql } from '@apollo/client';
import { RunCardRegistrationPolicyFieldsFragmentDoc } from '../EventsApp/EventPage/queries.generated';
import * as Apollo from '@apollo/client';
export type SignupModerationRunFieldsFragment = (
  { __typename?: 'Run' }
  & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at'>
  & { event?: Types.Maybe<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
  )> }
);

export type SignupModerationSignupRequestFieldsFragment = (
  { __typename?: 'SignupRequest' }
  & Pick<Types.SignupRequest, 'id' | 'state' | 'requested_bucket_key' | 'created_at'>
  & { user_con_profile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name'>
  ), replace_signup?: Types.Maybe<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & { run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & SignupModerationRunFieldsFragment
    ) }
  )>, target_run: (
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id' | 'signup_count_by_state_and_bucket_key_and_counted'>
    & { event?: Types.Maybe<(
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id'>
      & { registration_policy?: Types.Maybe<(
        { __typename?: 'RegistrationPolicy' }
        & { buckets: Array<(
          { __typename?: 'RegistrationPolicyBucket' }
          & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'total_slots' | 'slots_limited' | 'anything'>
        )> }
      )> }
    )> }
    & SignupModerationRunFieldsFragment
  ), result_signup?: Types.Maybe<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
  )> }
);

export type CreateSignupEventsQueryQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateSignupEventsQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { events_paginated: (
      { __typename?: 'EventsPagination' }
      & { entries: Array<(
        { __typename?: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list'>
        & { runs: Array<(
          { __typename?: 'Run' }
          & Pick<Types.Run, 'id' | 'starts_at' | 'title_suffix'>
          & { rooms: Array<(
            { __typename?: 'Room' }
            & Pick<Types.Room, 'id' | 'name'>
          )> }
        )> }
      )> }
    ) }
  )> }
);

export type CreateSignupRunCardQueryQueryVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  eventId: Types.Scalars['Int'];
}>;


export type CreateSignupRunCardQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_read_event_signups'>
  ), event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list'>
    & { registration_policy?: Types.Maybe<(
      { __typename?: 'RegistrationPolicy' }
      & RunCardRegistrationPolicyFieldsFragment
    )>, team_members: Array<(
      { __typename?: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { user_con_profile: (
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )>, event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), runs: Array<(
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at' | 'title_suffix' | 'signup_count_by_state_and_bucket_key_and_counted'>
      & { rooms: Array<(
        { __typename?: 'Room' }
        & Pick<Types.Room, 'id' | 'name'>
      )> }
    )> }
  ), userConProfile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    & { signups: Array<(
      { __typename?: 'Signup' }
      & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
      & { run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
      ) }
    )>, signup_requests: Array<(
      { __typename?: 'SignupRequest' }
      & Pick<Types.SignupRequest, 'id' | 'state'>
      & { target_run: (
        { __typename?: 'Run' }
        & Pick<Types.Run, 'id'>
      ) }
    )> }
  ) }
);

export type SignupModerationQueueQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupModerationQueueQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { signup_requests_paginated: (
      { __typename?: 'SignupRequestsPagination' }
      & Pick<Types.SignupRequestsPagination, 'total_pages'>
      & { entries: Array<(
        { __typename?: 'SignupRequest' }
        & Pick<Types.SignupRequest, 'id'>
        & SignupModerationSignupRequestFieldsFragment
      )> }
    ) }
  )> }
);

export const SignupModerationRunFieldsFragmentDoc = gql`
    fragment SignupModerationRunFields on Run {
  id
  title_suffix
  starts_at
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
    signup_count_by_state_and_bucket_key_and_counted
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
        }
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
 * __useCreateSignupEventsQueryQuery__
 *
 * To run a query within a React component, call `useCreateSignupEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateSignupEventsQueryQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateSignupEventsQueryQuery(baseOptions?: Apollo.QueryHookOptions<CreateSignupEventsQueryQuery, CreateSignupEventsQueryQueryVariables>) {
        return Apollo.useQuery<CreateSignupEventsQueryQuery, CreateSignupEventsQueryQueryVariables>(CreateSignupEventsQueryDocument, baseOptions);
      }
export function useCreateSignupEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateSignupEventsQueryQuery, CreateSignupEventsQueryQueryVariables>) {
          return Apollo.useLazyQuery<CreateSignupEventsQueryQuery, CreateSignupEventsQueryQueryVariables>(CreateSignupEventsQueryDocument, baseOptions);
        }
export type CreateSignupEventsQueryQueryHookResult = ReturnType<typeof useCreateSignupEventsQueryQuery>;
export type CreateSignupEventsQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupEventsQueryLazyQuery>;
export type CreateSignupEventsQueryQueryResult = Apollo.QueryResult<CreateSignupEventsQueryQuery, CreateSignupEventsQueryQueryVariables>;
export const CreateSignupRunCardQueryDocument = gql`
    query CreateSignupRunCardQuery($userConProfileId: Int!, $eventId: Int!) {
  currentAbility {
    can_read_event_signups(event_id: $eventId)
  }
  event(id: $eventId) {
    id
    title
    length_seconds
    private_signup_list
    registration_policy {
      ...RunCardRegistrationPolicyFields
    }
    team_members {
      id
      user_con_profile {
        id
      }
    }
    event_category {
      id
      team_member_name
    }
    runs {
      id
      starts_at
      title_suffix
      signup_count_by_state_and_bucket_key_and_counted
      rooms {
        id
        name
      }
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
    ${RunCardRegistrationPolicyFieldsFragmentDoc}`;

/**
 * __useCreateSignupRunCardQueryQuery__
 *
 * To run a query within a React component, call `useCreateSignupRunCardQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateSignupRunCardQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateSignupRunCardQueryQuery({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useCreateSignupRunCardQueryQuery(baseOptions?: Apollo.QueryHookOptions<CreateSignupRunCardQueryQuery, CreateSignupRunCardQueryQueryVariables>) {
        return Apollo.useQuery<CreateSignupRunCardQueryQuery, CreateSignupRunCardQueryQueryVariables>(CreateSignupRunCardQueryDocument, baseOptions);
      }
export function useCreateSignupRunCardQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateSignupRunCardQueryQuery, CreateSignupRunCardQueryQueryVariables>) {
          return Apollo.useLazyQuery<CreateSignupRunCardQueryQuery, CreateSignupRunCardQueryQueryVariables>(CreateSignupRunCardQueryDocument, baseOptions);
        }
export type CreateSignupRunCardQueryQueryHookResult = ReturnType<typeof useCreateSignupRunCardQueryQuery>;
export type CreateSignupRunCardQueryLazyQueryHookResult = ReturnType<typeof useCreateSignupRunCardQueryLazyQuery>;
export type CreateSignupRunCardQueryQueryResult = Apollo.QueryResult<CreateSignupRunCardQueryQuery, CreateSignupRunCardQueryQueryVariables>;
export const SignupModerationQueueQueryDocument = gql`
    query SignupModerationQueueQuery($page: Int) {
  convention {
    id
    signup_requests_paginated(sort: [{field: "state", desc: false}, {field: "created_at", desc: false}], page: $page, per_page: 10) {
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
 * __useSignupModerationQueueQueryQuery__
 *
 * To run a query within a React component, call `useSignupModerationQueueQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupModerationQueueQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupModerationQueueQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useSignupModerationQueueQueryQuery(baseOptions?: Apollo.QueryHookOptions<SignupModerationQueueQueryQuery, SignupModerationQueueQueryQueryVariables>) {
        return Apollo.useQuery<SignupModerationQueueQueryQuery, SignupModerationQueueQueryQueryVariables>(SignupModerationQueueQueryDocument, baseOptions);
      }
export function useSignupModerationQueueQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupModerationQueueQueryQuery, SignupModerationQueueQueryQueryVariables>) {
          return Apollo.useLazyQuery<SignupModerationQueueQueryQuery, SignupModerationQueueQueryQueryVariables>(SignupModerationQueueQueryDocument, baseOptions);
        }
export type SignupModerationQueueQueryQueryHookResult = ReturnType<typeof useSignupModerationQueueQueryQuery>;
export type SignupModerationQueueQueryLazyQueryHookResult = ReturnType<typeof useSignupModerationQueueQueryLazyQuery>;
export type SignupModerationQueueQueryQueryResult = Apollo.QueryResult<SignupModerationQueueQueryQuery, SignupModerationQueueQueryQueryVariables>;