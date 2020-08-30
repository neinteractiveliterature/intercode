/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
export type SignupFieldsFragment = (
  { __typename?: 'Signup' }
  & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key'>
  & { run: (
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at' | 'ends_at'>
    & { rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Types.Room, 'id' | 'name'>
    )>, event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'title'>
      & { event_category: (
        { __typename?: 'EventCategory' }
        & Pick<Types.EventCategory, 'id' | 'team_member_name'>
      ), registration_policy?: Types.Maybe<(
        { __typename?: 'RegistrationPolicy' }
        & { buckets: Array<(
          { __typename?: 'RegistrationPolicyBucket' }
          & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
        )> }
      )>, team_members: Array<(
        { __typename?: 'TeamMember' }
        & Pick<Types.TeamMember, 'id'>
        & { user_con_profile: (
          { __typename?: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id'>
        ) }
      )> }
    ) }
  ), user_con_profile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'nickname' | 'birth_date' | 'email' | 'address' | 'city' | 'state' | 'zipcode' | 'country' | 'mobile_phone' | 'gravatar_enabled' | 'gravatar_url'>
  ) }
);

export type UserConProfileSignupsFragmentFragment = (
  { __typename?: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id'>
  & { signups: Array<(
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key'>
    & { user_con_profile: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ), run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at'>
      & { event: (
        { __typename?: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
        & { event_category: (
          { __typename?: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'team_member_name'>
        ), registration_policy?: Types.Maybe<(
          { __typename?: 'RegistrationPolicy' }
          & { buckets: Array<(
            { __typename?: 'RegistrationPolicyBucket' }
            & Pick<Types.RegistrationPolicyBucket, 'key' | 'name'>
          )> }
        )>, team_members: Array<(
          { __typename?: 'TeamMember' }
          & Pick<Types.TeamMember, 'id'>
          & { user_con_profile: (
            { __typename?: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id'>
          ) }
        )> }
      ), rooms: Array<(
        { __typename?: 'Room' }
        & Pick<Types.Room, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export type SignupAdminEventQueryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type SignupAdminEventQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
  ) }
);

export type AdminSignupQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type AdminSignupQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_update_bucket_signup' | 'can_force_confirm_signup' | 'can_update_counted_signup'>
  ), signup: (
    { __typename?: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & SignupFieldsFragment
  ) }
);

export type RunSignupsTableSignupsQueryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.SignupFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type RunSignupsTableSignupsQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), team_members: Array<(
      { __typename?: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { user_con_profile: (
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )>, registration_policy?: Types.Maybe<(
      { __typename?: 'RegistrationPolicy' }
      & { buckets: Array<(
        { __typename?: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'key' | 'name'>
      )> }
    )>, run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & { signups_paginated: (
        { __typename?: 'SignupsPagination' }
        & Pick<Types.SignupsPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
        & { entries: Array<(
          { __typename?: 'Signup' }
          & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key' | 'age_restrictions_check'>
          & { run: (
            { __typename?: 'Run' }
            & Pick<Types.Run, 'id' | 'starts_at'>
          ), user_con_profile: (
            { __typename?: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'name_without_nickname' | 'gravatar_enabled' | 'gravatar_url' | 'email' | 'birth_date'>
          ) }
        )> }
      ) }
    ) }
  ) }
);

export type RunHeaderRunInfoQueryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
}>;


export type RunHeaderRunInfoQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
    & { registration_policy?: Types.Maybe<(
      { __typename?: 'RegistrationPolicy' }
      & Pick<Types.RegistrationPolicy, 'total_slots' | 'slots_limited'>
      & { buckets: Array<(
        { __typename?: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'name' | 'total_slots'>
      )> }
    )>, run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at'>
    ) }
  ) }
);

export type RunSignupSummaryQueryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
}>;


export type RunSignupSummaryQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule'>
  ), event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), registration_policy?: Types.Maybe<(
      { __typename?: 'RegistrationPolicy' }
      & { buckets: Array<(
        { __typename?: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'expose_attendees'>
      )> }
    )>, team_members: Array<(
      { __typename?: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { user_con_profile: (
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )>, runs: Array<(
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
    )>, run: (
      { __typename?: 'Run' }
      & Pick<Types.Run, 'id'>
      & { signups_paginated: (
        { __typename?: 'SignupsPagination' }
        & { entries: Array<(
          { __typename?: 'Signup' }
          & Pick<Types.Signup, 'id' | 'state' | 'bucket_key' | 'waitlist_position'>
          & { user_con_profile: (
            { __typename?: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
          ) }
        )> }
      ) }
    ) }
  ) }
);

export type UserConProfileSignupsQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileSignupsQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { ability?: Types.Maybe<(
      { __typename?: 'Ability' }
      & Pick<Types.Ability, 'can_withdraw_all_user_con_profile_signups'>
    )> }
  )>, userConProfile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'ical_secret'>
    & { team_members: Array<(
      { __typename?: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { event: (
        { __typename?: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'status'>
      ) }
    )> }
    & UserConProfileSignupsFragmentFragment
  ) }
);

export type RunSignupChangesQueryQueryVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
  filters?: Types.Maybe<Types.SignupChangeFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type RunSignupChangesQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
  )>, run: (
    { __typename?: 'Run' }
    & Pick<Types.Run, 'id'>
    & { event: (
      { __typename?: 'Event' }
      & Pick<Types.Event, 'id' | 'title'>
    ), signup_changes_paginated: (
      { __typename?: 'SignupChangesPagination' }
      & Pick<Types.SignupChangesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename?: 'SignupChange' }
        & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key' | 'action' | 'created_at'>
        & { previous_signup_change?: Types.Maybe<(
          { __typename?: 'SignupChange' }
          & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key'>
        )>, run: (
          { __typename?: 'Run' }
          & Pick<Types.Run, 'id'>
          & { event: (
            { __typename?: 'Event' }
            & Pick<Types.Event, 'id' | 'title'>
            & { event_category: (
              { __typename?: 'EventCategory' }
              & Pick<Types.EventCategory, 'id' | 'team_member_name'>
            ), registration_policy?: Types.Maybe<(
              { __typename?: 'RegistrationPolicy' }
              & { buckets: Array<(
                { __typename?: 'RegistrationPolicyBucket' }
                & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
              )> }
            )>, team_members: Array<(
              { __typename?: 'TeamMember' }
              & Pick<Types.TeamMember, 'id'>
              & { user_con_profile: (
                { __typename?: 'UserConProfile' }
                & Pick<Types.UserConProfile, 'id'>
              ) }
            )> }
          ) }
        ), user_con_profile: (
          { __typename?: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
        ) }
      )> }
    ) }
  ) }
);

export const SignupFieldsFragmentDoc = gql`
    fragment SignupFields on Signup {
  id
  state
  counted
  bucket_key
  requested_bucket_key
  run {
    id
    title_suffix
    starts_at
    ends_at
    rooms {
      id
      name
    }
    event {
      id
      title
      event_category {
        id
        team_member_name
      }
      registration_policy {
        buckets {
          key
          name
          anything
        }
      }
      team_members {
        id
        user_con_profile {
          id
        }
      }
    }
  }
  user_con_profile {
    id
    name_without_nickname
    nickname
    birth_date
    email
    address
    city
    state
    zipcode
    country
    mobile_phone
    gravatar_enabled
    gravatar_url
  }
}
    `;
export const UserConProfileSignupsFragmentFragmentDoc = gql`
    fragment UserConProfileSignupsFragment on UserConProfile {
  id
  signups {
    id
    state
    counted
    bucket_key
    requested_bucket_key
    user_con_profile {
      id
    }
    run {
      id
      starts_at
      event {
        id
        title
        length_seconds
        event_category {
          id
          team_member_name
        }
        registration_policy {
          buckets {
            key
            name
          }
        }
        team_members {
          id
          user_con_profile {
            id
          }
        }
      }
      rooms {
        id
        name
      }
    }
  }
}
    `;
export const SignupAdminEventQueryDocument = gql`
    query SignupAdminEventQuery($eventId: Int!) {
  convention {
    id
    ...CommonConventionData
  }
  event(id: $eventId) {
    id
    title
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useSignupAdminEventQueryQuery__
 *
 * To run a query within a React component, call `useSignupAdminEventQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupAdminEventQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupAdminEventQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useSignupAdminEventQueryQuery(baseOptions?: Apollo.QueryHookOptions<SignupAdminEventQueryQuery, SignupAdminEventQueryQueryVariables>) {
        return Apollo.useQuery<SignupAdminEventQueryQuery, SignupAdminEventQueryQueryVariables>(SignupAdminEventQueryDocument, baseOptions);
      }
export function useSignupAdminEventQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupAdminEventQueryQuery, SignupAdminEventQueryQueryVariables>) {
          return Apollo.useLazyQuery<SignupAdminEventQueryQuery, SignupAdminEventQueryQueryVariables>(SignupAdminEventQueryDocument, baseOptions);
        }
export type SignupAdminEventQueryQueryHookResult = ReturnType<typeof useSignupAdminEventQueryQuery>;
export type SignupAdminEventQueryLazyQueryHookResult = ReturnType<typeof useSignupAdminEventQueryLazyQuery>;
export type SignupAdminEventQueryQueryResult = Apollo.QueryResult<SignupAdminEventQueryQuery, SignupAdminEventQueryQueryVariables>;
export const AdminSignupQueryDocument = gql`
    query AdminSignupQuery($id: Int!) {
  convention {
    id
    ...CommonConventionData
  }
  currentAbility {
    can_update_bucket_signup(signup_id: $id)
    can_force_confirm_signup(signup_id: $id)
    can_update_counted_signup(signup_id: $id)
  }
  signup(id: $id) {
    id
    ...SignupFields
  }
}
    ${CommonConventionDataFragmentDoc}
${SignupFieldsFragmentDoc}`;

/**
 * __useAdminSignupQueryQuery__
 *
 * To run a query within a React component, call `useAdminSignupQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSignupQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSignupQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminSignupQueryQuery(baseOptions?: Apollo.QueryHookOptions<AdminSignupQueryQuery, AdminSignupQueryQueryVariables>) {
        return Apollo.useQuery<AdminSignupQueryQuery, AdminSignupQueryQueryVariables>(AdminSignupQueryDocument, baseOptions);
      }
export function useAdminSignupQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminSignupQueryQuery, AdminSignupQueryQueryVariables>) {
          return Apollo.useLazyQuery<AdminSignupQueryQuery, AdminSignupQueryQueryVariables>(AdminSignupQueryDocument, baseOptions);
        }
export type AdminSignupQueryQueryHookResult = ReturnType<typeof useAdminSignupQueryQuery>;
export type AdminSignupQueryLazyQueryHookResult = ReturnType<typeof useAdminSignupQueryLazyQuery>;
export type AdminSignupQueryQueryResult = Apollo.QueryResult<AdminSignupQueryQuery, AdminSignupQueryQueryVariables>;
export const RunSignupsTableSignupsQueryDocument = gql`
    query RunSignupsTableSignupsQuery($eventId: Int!, $runId: Int!, $page: Int, $perPage: Int, $filters: SignupFiltersInput, $sort: [SortInput!]) {
  convention {
    id
    name
  }
  event(id: $eventId) {
    id
    title
    event_category {
      id
      team_member_name
    }
    team_members {
      id
      user_con_profile {
        id
      }
    }
    registration_policy {
      buckets {
        key
        name
      }
    }
    run(id: $runId) {
      id
      signups_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page
        entries {
          id
          state
          counted
          bucket_key
          requested_bucket_key
          age_restrictions_check
          run {
            id
            starts_at
          }
          user_con_profile {
            id
            name_inverted
            name_without_nickname
            gravatar_enabled
            gravatar_url
            email
            birth_date
          }
        }
      }
    }
  }
}
    `;

/**
 * __useRunSignupsTableSignupsQueryQuery__
 *
 * To run a query within a React component, call `useRunSignupsTableSignupsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupsTableSignupsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupsTableSignupsQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      runId: // value for 'runId'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRunSignupsTableSignupsQueryQuery(baseOptions?: Apollo.QueryHookOptions<RunSignupsTableSignupsQueryQuery, RunSignupsTableSignupsQueryQueryVariables>) {
        return Apollo.useQuery<RunSignupsTableSignupsQueryQuery, RunSignupsTableSignupsQueryQueryVariables>(RunSignupsTableSignupsQueryDocument, baseOptions);
      }
export function useRunSignupsTableSignupsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupsTableSignupsQueryQuery, RunSignupsTableSignupsQueryQueryVariables>) {
          return Apollo.useLazyQuery<RunSignupsTableSignupsQueryQuery, RunSignupsTableSignupsQueryQueryVariables>(RunSignupsTableSignupsQueryDocument, baseOptions);
        }
export type RunSignupsTableSignupsQueryQueryHookResult = ReturnType<typeof useRunSignupsTableSignupsQueryQuery>;
export type RunSignupsTableSignupsQueryLazyQueryHookResult = ReturnType<typeof useRunSignupsTableSignupsQueryLazyQuery>;
export type RunSignupsTableSignupsQueryQueryResult = Apollo.QueryResult<RunSignupsTableSignupsQueryQuery, RunSignupsTableSignupsQueryQueryVariables>;
export const RunHeaderRunInfoQueryDocument = gql`
    query RunHeaderRunInfoQuery($eventId: Int!, $runId: Int!) {
  convention {
    id
    ...CommonConventionData
  }
  event(id: $eventId) {
    id
    title
    length_seconds
    registration_policy {
      total_slots
      slots_limited
      buckets {
        name
        total_slots
      }
    }
    run(id: $runId) {
      id
      starts_at
    }
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useRunHeaderRunInfoQueryQuery__
 *
 * To run a query within a React component, call `useRunHeaderRunInfoQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunHeaderRunInfoQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunHeaderRunInfoQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useRunHeaderRunInfoQueryQuery(baseOptions?: Apollo.QueryHookOptions<RunHeaderRunInfoQueryQuery, RunHeaderRunInfoQueryQueryVariables>) {
        return Apollo.useQuery<RunHeaderRunInfoQueryQuery, RunHeaderRunInfoQueryQueryVariables>(RunHeaderRunInfoQueryDocument, baseOptions);
      }
export function useRunHeaderRunInfoQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunHeaderRunInfoQueryQuery, RunHeaderRunInfoQueryQueryVariables>) {
          return Apollo.useLazyQuery<RunHeaderRunInfoQueryQuery, RunHeaderRunInfoQueryQueryVariables>(RunHeaderRunInfoQueryDocument, baseOptions);
        }
export type RunHeaderRunInfoQueryQueryHookResult = ReturnType<typeof useRunHeaderRunInfoQueryQuery>;
export type RunHeaderRunInfoQueryLazyQueryHookResult = ReturnType<typeof useRunHeaderRunInfoQueryLazyQuery>;
export type RunHeaderRunInfoQueryQueryResult = Apollo.QueryResult<RunHeaderRunInfoQueryQuery, RunHeaderRunInfoQueryQueryVariables>;
export const RunSignupSummaryQueryDocument = gql`
    query RunSignupSummaryQuery($eventId: Int!, $runId: Int!) {
  convention {
    id
    ...CommonConventionData
  }
  currentAbility {
    can_read_schedule
  }
  event(id: $eventId) {
    id
    title
    event_category {
      id
      team_member_name
    }
    registration_policy {
      buckets {
        key
        name
        expose_attendees
      }
    }
    team_members {
      id
      user_con_profile {
        id
      }
    }
    runs {
      id
    }
    run(id: $runId) {
      id
      signups_paginated(per_page: 1000, filters: {state: ["confirmed", "waitlisted"]}) {
        entries {
          id
          state
          bucket_key
          waitlist_position
          user_con_profile {
            id
            name_inverted
            gravatar_enabled
            gravatar_url
          }
        }
      }
    }
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useRunSignupSummaryQueryQuery__
 *
 * To run a query within a React component, call `useRunSignupSummaryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupSummaryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupSummaryQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useRunSignupSummaryQueryQuery(baseOptions?: Apollo.QueryHookOptions<RunSignupSummaryQueryQuery, RunSignupSummaryQueryQueryVariables>) {
        return Apollo.useQuery<RunSignupSummaryQueryQuery, RunSignupSummaryQueryQueryVariables>(RunSignupSummaryQueryDocument, baseOptions);
      }
export function useRunSignupSummaryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupSummaryQueryQuery, RunSignupSummaryQueryQueryVariables>) {
          return Apollo.useLazyQuery<RunSignupSummaryQueryQuery, RunSignupSummaryQueryQueryVariables>(RunSignupSummaryQueryDocument, baseOptions);
        }
export type RunSignupSummaryQueryQueryHookResult = ReturnType<typeof useRunSignupSummaryQueryQuery>;
export type RunSignupSummaryQueryLazyQueryHookResult = ReturnType<typeof useRunSignupSummaryQueryLazyQuery>;
export type RunSignupSummaryQueryQueryResult = Apollo.QueryResult<RunSignupSummaryQueryQuery, RunSignupSummaryQueryQueryVariables>;
export const UserConProfileSignupsQueryDocument = gql`
    query UserConProfileSignupsQuery($id: Int!) {
  convention {
    id
    ...CommonConventionData
  }
  myProfile {
    id
    ability {
      can_withdraw_all_user_con_profile_signups(user_con_profile_id: $id)
    }
  }
  userConProfile(id: $id) {
    id
    name_without_nickname
    ical_secret
    team_members {
      id
      event {
        id
        title
        status
      }
    }
    ...UserConProfileSignupsFragment
  }
}
    ${CommonConventionDataFragmentDoc}
${UserConProfileSignupsFragmentFragmentDoc}`;

/**
 * __useUserConProfileSignupsQueryQuery__
 *
 * To run a query within a React component, call `useUserConProfileSignupsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileSignupsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileSignupsQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileSignupsQueryQuery(baseOptions?: Apollo.QueryHookOptions<UserConProfileSignupsQueryQuery, UserConProfileSignupsQueryQueryVariables>) {
        return Apollo.useQuery<UserConProfileSignupsQueryQuery, UserConProfileSignupsQueryQueryVariables>(UserConProfileSignupsQueryDocument, baseOptions);
      }
export function useUserConProfileSignupsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileSignupsQueryQuery, UserConProfileSignupsQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserConProfileSignupsQueryQuery, UserConProfileSignupsQueryQueryVariables>(UserConProfileSignupsQueryDocument, baseOptions);
        }
export type UserConProfileSignupsQueryQueryHookResult = ReturnType<typeof useUserConProfileSignupsQueryQuery>;
export type UserConProfileSignupsQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileSignupsQueryLazyQuery>;
export type UserConProfileSignupsQueryQueryResult = Apollo.QueryResult<UserConProfileSignupsQueryQuery, UserConProfileSignupsQueryQueryVariables>;
export const RunSignupChangesQueryDocument = gql`
    query RunSignupChangesQuery($runId: Int!, $filters: SignupChangeFiltersInput, $sort: [SortInput!], $page: Int, $perPage: Int) {
  convention {
    id
    timezone_name
  }
  run(id: $runId) {
    id
    event {
      id
      title
    }
    signup_changes_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      total_entries
      total_pages
      current_page
      per_page
      entries {
        id
        state
        counted
        bucket_key
        action
        created_at
        previous_signup_change {
          id
          state
          counted
          bucket_key
        }
        run {
          id
          event {
            id
            title
            event_category {
              id
              team_member_name
            }
            registration_policy {
              buckets {
                key
                name
                anything
              }
            }
            team_members {
              id
              user_con_profile {
                id
              }
            }
          }
        }
        user_con_profile {
          id
          name_inverted
          gravatar_enabled
          gravatar_url
        }
      }
    }
  }
}
    `;

/**
 * __useRunSignupChangesQueryQuery__
 *
 * To run a query within a React component, call `useRunSignupChangesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupChangesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupChangesQueryQuery({
 *   variables: {
 *      runId: // value for 'runId'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useRunSignupChangesQueryQuery(baseOptions?: Apollo.QueryHookOptions<RunSignupChangesQueryQuery, RunSignupChangesQueryQueryVariables>) {
        return Apollo.useQuery<RunSignupChangesQueryQuery, RunSignupChangesQueryQueryVariables>(RunSignupChangesQueryDocument, baseOptions);
      }
export function useRunSignupChangesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupChangesQueryQuery, RunSignupChangesQueryQueryVariables>) {
          return Apollo.useLazyQuery<RunSignupChangesQueryQuery, RunSignupChangesQueryQueryVariables>(RunSignupChangesQueryDocument, baseOptions);
        }
export type RunSignupChangesQueryQueryHookResult = ReturnType<typeof useRunSignupChangesQueryQuery>;
export type RunSignupChangesQueryLazyQueryHookResult = ReturnType<typeof useRunSignupChangesQueryLazyQuery>;
export type RunSignupChangesQueryQueryResult = Apollo.QueryResult<RunSignupChangesQueryQuery, RunSignupChangesQueryQueryVariables>;