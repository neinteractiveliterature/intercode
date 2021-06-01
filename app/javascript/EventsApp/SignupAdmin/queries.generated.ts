/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SignupFieldsFragment = (
  { __typename: 'Signup' }
  & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key'>
  & { run: (
    { __typename: 'Run' }
    & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at' | 'ends_at'>
    & { rooms: Array<(
      { __typename: 'Room' }
      & Pick<Types.Room, 'id' | 'name'>
    )>, event: (
      { __typename: 'Event' }
      & Pick<Types.Event, 'id' | 'title'>
      & { event_category: (
        { __typename: 'EventCategory' }
        & Pick<Types.EventCategory, 'id' | 'team_member_name'>
      ), registration_policy?: Types.Maybe<(
        { __typename: 'RegistrationPolicy' }
        & { buckets: Array<(
          { __typename: 'RegistrationPolicyBucket' }
          & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
        )> }
      )>, team_members: Array<(
        { __typename: 'TeamMember' }
        & Pick<Types.TeamMember, 'id'>
        & { user_con_profile: (
          { __typename: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id'>
        ) }
      )> }
    ) }
  ), user_con_profile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'nickname' | 'birth_date' | 'email' | 'address' | 'city' | 'state' | 'zipcode' | 'country' | 'mobile_phone' | 'gravatar_enabled' | 'gravatar_url'>
  ) }
);

export type UserConProfileSignupsFragment = (
  { __typename: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id'>
  & { signups: Array<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key'>
    & { user_con_profile: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ), run: (
      { __typename: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at'>
      & { event: (
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
        & { event_category: (
          { __typename: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'team_member_name'>
        ), registration_policy?: Types.Maybe<(
          { __typename: 'RegistrationPolicy' }
          & { buckets: Array<(
            { __typename: 'RegistrationPolicyBucket' }
            & Pick<Types.RegistrationPolicyBucket, 'key' | 'name'>
          )> }
        )>, team_members: Array<(
          { __typename: 'TeamMember' }
          & Pick<Types.TeamMember, 'id'>
          & { user_con_profile: (
            { __typename: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id'>
          ) }
        )> }
      ), rooms: Array<(
        { __typename: 'Room' }
        & Pick<Types.Room, 'id' | 'name'>
      )> }
    ) }
  )> }
);

export type SignupAdminEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type SignupAdminEventQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
  ) }
);

export type AdminSignupQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type AdminSignupQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_update_bucket_signup' | 'can_force_confirm_signup' | 'can_update_counted_signup'>
  ), signup: (
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & SignupFieldsFragment
  ) }
);

export type RunSignupsTableSignupsQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.SignupFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type RunSignupsTableSignupsQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { user_con_profile: (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )>, registration_policy?: Types.Maybe<(
      { __typename: 'RegistrationPolicy' }
      & { buckets: Array<(
        { __typename: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'key' | 'name'>
      )> }
    )>, run: (
      { __typename: 'Run' }
      & Pick<Types.Run, 'id'>
      & { signups_paginated: (
        { __typename: 'SignupsPagination' }
        & Pick<Types.SignupsPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
        & { entries: Array<(
          { __typename: 'Signup' }
          & Pick<Types.Signup, 'id' | 'state' | 'counted' | 'bucket_key' | 'requested_bucket_key' | 'age_restrictions_check'>
          & { run: (
            { __typename: 'Run' }
            & Pick<Types.Run, 'id' | 'starts_at'>
          ), user_con_profile: (
            { __typename: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'name_without_nickname' | 'gravatar_enabled' | 'gravatar_url' | 'email' | 'birth_date'>
          ) }
        )> }
      ) }
    ) }
  ) }
);

export type RunHeaderRunInfoQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
}>;


export type RunHeaderRunInfoQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds'>
    & { registration_policy?: Types.Maybe<(
      { __typename: 'RegistrationPolicy' }
      & Pick<Types.RegistrationPolicy, 'total_slots' | 'slots_limited'>
      & { buckets: Array<(
        { __typename: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'name' | 'total_slots'>
      )> }
    )>, run: (
      { __typename: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at' | 'title_suffix'>
    ) }
  ) }
);

export type RunSignupSummaryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  runId: Types.Scalars['Int'];
}>;


export type RunSignupSummaryQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule'>
  ), event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), registration_policy?: Types.Maybe<(
      { __typename: 'RegistrationPolicy' }
      & { buckets: Array<(
        { __typename: 'RegistrationPolicyBucket' }
        & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'expose_attendees'>
      )> }
    )>, team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { user_con_profile: (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id'>
      ) }
    )>, runs: Array<(
      { __typename: 'Run' }
      & Pick<Types.Run, 'id' | 'starts_at'>
    )>, run: (
      { __typename: 'Run' }
      & Pick<Types.Run, 'id'>
      & { signups_paginated: (
        { __typename: 'SignupsPagination' }
        & { entries: Array<(
          { __typename: 'Signup' }
          & Pick<Types.Signup, 'id' | 'state' | 'bucket_key' | 'waitlist_position'>
          & { user_con_profile: (
            { __typename: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
          ) }
        )> }
      ) }
    ) }
  ) }
);

export type UserConProfileSignupsQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileSignupsQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { ability?: Types.Maybe<(
      { __typename: 'Ability' }
      & Pick<Types.Ability, 'can_withdraw_all_user_con_profile_signups'>
    )> }
  )>, userConProfile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'ical_secret'>
    & { team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id'>
      & { event: (
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title' | 'status'>
      ) }
    )> }
    & UserConProfileSignupsFragment
  ) }
);

export type RunSignupChangesQueryVariables = Types.Exact<{
  runId: Types.Scalars['Int'];
  filters?: Types.Maybe<Types.SignupChangeFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type RunSignupChangesQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
  )>, run: (
    { __typename: 'Run' }
    & Pick<Types.Run, 'id'>
    & { event: (
      { __typename: 'Event' }
      & Pick<Types.Event, 'id' | 'title'>
    ), signup_changes_paginated: (
      { __typename: 'SignupChangesPagination' }
      & Pick<Types.SignupChangesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename: 'SignupChange' }
        & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key' | 'action' | 'created_at'>
        & { previous_signup_change?: Types.Maybe<(
          { __typename: 'SignupChange' }
          & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key'>
        )>, run: (
          { __typename: 'Run' }
          & Pick<Types.Run, 'id'>
          & { event: (
            { __typename: 'Event' }
            & Pick<Types.Event, 'id' | 'title'>
            & { event_category: (
              { __typename: 'EventCategory' }
              & Pick<Types.EventCategory, 'id' | 'team_member_name'>
            ), registration_policy?: Types.Maybe<(
              { __typename: 'RegistrationPolicy' }
              & { buckets: Array<(
                { __typename: 'RegistrationPolicyBucket' }
                & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
              )> }
            )>, team_members: Array<(
              { __typename: 'TeamMember' }
              & Pick<Types.TeamMember, 'id'>
              & { user_con_profile: (
                { __typename: 'UserConProfile' }
                & Pick<Types.UserConProfile, 'id'>
              ) }
            )> }
          ) }
        ), user_con_profile: (
          { __typename: 'UserConProfile' }
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
export const UserConProfileSignupsFragmentDoc = gql`
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
 * __useSignupAdminEventQuery__
 *
 * To run a query within a React component, call `useSignupAdminEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupAdminEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupAdminEventQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useSignupAdminEventQuery(baseOptions: Apollo.QueryHookOptions<SignupAdminEventQueryData, SignupAdminEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupAdminEventQueryData, SignupAdminEventQueryVariables>(SignupAdminEventQueryDocument, options);
      }
export function useSignupAdminEventQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupAdminEventQueryData, SignupAdminEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupAdminEventQueryData, SignupAdminEventQueryVariables>(SignupAdminEventQueryDocument, options);
        }
export type SignupAdminEventQueryHookResult = ReturnType<typeof useSignupAdminEventQuery>;
export type SignupAdminEventQueryLazyQueryHookResult = ReturnType<typeof useSignupAdminEventQueryLazyQuery>;
export type SignupAdminEventQueryQueryResult = Apollo.QueryResult<SignupAdminEventQueryData, SignupAdminEventQueryVariables>;
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
 * __useAdminSignupQuery__
 *
 * To run a query within a React component, call `useAdminSignupQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSignupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSignupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminSignupQuery(baseOptions: Apollo.QueryHookOptions<AdminSignupQueryData, AdminSignupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminSignupQueryData, AdminSignupQueryVariables>(AdminSignupQueryDocument, options);
      }
export function useAdminSignupQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminSignupQueryData, AdminSignupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminSignupQueryData, AdminSignupQueryVariables>(AdminSignupQueryDocument, options);
        }
export type AdminSignupQueryHookResult = ReturnType<typeof useAdminSignupQuery>;
export type AdminSignupQueryLazyQueryHookResult = ReturnType<typeof useAdminSignupQueryLazyQuery>;
export type AdminSignupQueryQueryResult = Apollo.QueryResult<AdminSignupQueryData, AdminSignupQueryVariables>;
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
      signups_paginated(
        page: $page
        per_page: $perPage
        filters: $filters
        sort: $sort
      ) {
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
 * __useRunSignupsTableSignupsQuery__
 *
 * To run a query within a React component, call `useRunSignupsTableSignupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupsTableSignupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupsTableSignupsQuery({
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
export function useRunSignupsTableSignupsQuery(baseOptions: Apollo.QueryHookOptions<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>(RunSignupsTableSignupsQueryDocument, options);
      }
export function useRunSignupsTableSignupsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>(RunSignupsTableSignupsQueryDocument, options);
        }
export type RunSignupsTableSignupsQueryHookResult = ReturnType<typeof useRunSignupsTableSignupsQuery>;
export type RunSignupsTableSignupsQueryLazyQueryHookResult = ReturnType<typeof useRunSignupsTableSignupsQueryLazyQuery>;
export type RunSignupsTableSignupsQueryQueryResult = Apollo.QueryResult<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>;
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
      title_suffix
    }
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useRunHeaderRunInfoQuery__
 *
 * To run a query within a React component, call `useRunHeaderRunInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunHeaderRunInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunHeaderRunInfoQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useRunHeaderRunInfoQuery(baseOptions: Apollo.QueryHookOptions<RunHeaderRunInfoQueryData, RunHeaderRunInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RunHeaderRunInfoQueryData, RunHeaderRunInfoQueryVariables>(RunHeaderRunInfoQueryDocument, options);
      }
export function useRunHeaderRunInfoQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunHeaderRunInfoQueryData, RunHeaderRunInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RunHeaderRunInfoQueryData, RunHeaderRunInfoQueryVariables>(RunHeaderRunInfoQueryDocument, options);
        }
export type RunHeaderRunInfoQueryHookResult = ReturnType<typeof useRunHeaderRunInfoQuery>;
export type RunHeaderRunInfoQueryLazyQueryHookResult = ReturnType<typeof useRunHeaderRunInfoQueryLazyQuery>;
export type RunHeaderRunInfoQueryQueryResult = Apollo.QueryResult<RunHeaderRunInfoQueryData, RunHeaderRunInfoQueryVariables>;
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
      starts_at
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
 * __useRunSignupSummaryQuery__
 *
 * To run a query within a React component, call `useRunSignupSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupSummaryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useRunSignupSummaryQuery(baseOptions: Apollo.QueryHookOptions<RunSignupSummaryQueryData, RunSignupSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RunSignupSummaryQueryData, RunSignupSummaryQueryVariables>(RunSignupSummaryQueryDocument, options);
      }
export function useRunSignupSummaryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupSummaryQueryData, RunSignupSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RunSignupSummaryQueryData, RunSignupSummaryQueryVariables>(RunSignupSummaryQueryDocument, options);
        }
export type RunSignupSummaryQueryHookResult = ReturnType<typeof useRunSignupSummaryQuery>;
export type RunSignupSummaryQueryLazyQueryHookResult = ReturnType<typeof useRunSignupSummaryQueryLazyQuery>;
export type RunSignupSummaryQueryQueryResult = Apollo.QueryResult<RunSignupSummaryQueryData, RunSignupSummaryQueryVariables>;
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
${UserConProfileSignupsFragmentDoc}`;

/**
 * __useUserConProfileSignupsQuery__
 *
 * To run a query within a React component, call `useUserConProfileSignupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileSignupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileSignupsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileSignupsQuery(baseOptions: Apollo.QueryHookOptions<UserConProfileSignupsQueryData, UserConProfileSignupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfileSignupsQueryData, UserConProfileSignupsQueryVariables>(UserConProfileSignupsQueryDocument, options);
      }
export function useUserConProfileSignupsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileSignupsQueryData, UserConProfileSignupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfileSignupsQueryData, UserConProfileSignupsQueryVariables>(UserConProfileSignupsQueryDocument, options);
        }
export type UserConProfileSignupsQueryHookResult = ReturnType<typeof useUserConProfileSignupsQuery>;
export type UserConProfileSignupsQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileSignupsQueryLazyQuery>;
export type UserConProfileSignupsQueryQueryResult = Apollo.QueryResult<UserConProfileSignupsQueryData, UserConProfileSignupsQueryVariables>;
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
    signup_changes_paginated(
      page: $page
      per_page: $perPage
      filters: $filters
      sort: $sort
    ) {
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
 * __useRunSignupChangesQuery__
 *
 * To run a query within a React component, call `useRunSignupChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunSignupChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunSignupChangesQuery({
 *   variables: {
 *      runId: // value for 'runId'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useRunSignupChangesQuery(baseOptions: Apollo.QueryHookOptions<RunSignupChangesQueryData, RunSignupChangesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RunSignupChangesQueryData, RunSignupChangesQueryVariables>(RunSignupChangesQueryDocument, options);
      }
export function useRunSignupChangesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunSignupChangesQueryData, RunSignupChangesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RunSignupChangesQueryData, RunSignupChangesQueryVariables>(RunSignupChangesQueryDocument, options);
        }
export type RunSignupChangesQueryHookResult = ReturnType<typeof useRunSignupChangesQuery>;
export type RunSignupChangesQueryLazyQueryHookResult = ReturnType<typeof useRunSignupChangesQueryLazyQuery>;
export type RunSignupChangesQueryQueryResult = Apollo.QueryResult<RunSignupChangesQueryData, RunSignupChangesQueryVariables>;