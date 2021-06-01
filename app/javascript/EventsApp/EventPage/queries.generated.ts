/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonConventionDataFragment } from '../queries.generated';
import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MySignupFieldsFragment = (
  { __typename: 'Signup' }
  & Pick<Types.Signup, 'id' | 'state' | 'waitlist_position'>
);

export type MySignupRequestFieldsFragment = (
  { __typename: 'SignupRequest' }
  & Pick<Types.SignupRequest, 'id' | 'state' | 'requested_bucket_key'>
  & { target_run: (
    { __typename: 'Run' }
    & Pick<Types.Run, 'id'>
  ), replace_signup?: Types.Maybe<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id'>
  )> }
);

export type EventPageRunFieldsFragment = (
  { __typename: 'Run' }
  & Pick<Types.Run, 'id' | 'title_suffix' | 'starts_at' | 'current_ability_can_signup_summary_run' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { rooms: Array<(
    { __typename: 'Room' }
    & Pick<Types.Room, 'id' | 'name'>
  )>, my_signups: Array<(
    { __typename: 'Signup' }
    & Pick<Types.Signup, 'id'>
    & MySignupFieldsFragment
  )>, my_signup_requests: Array<(
    { __typename: 'SignupRequest' }
    & Pick<Types.SignupRequest, 'id'>
    & MySignupRequestFieldsFragment
  )> }
);

export type RunCardRegistrationPolicyFieldsFragment = (
  { __typename: 'RegistrationPolicy' }
  & Pick<Types.RegistrationPolicy, 'slots_limited' | 'prevent_no_preference_signups' | 'total_slots_including_not_counted'>
  & { buckets: Array<(
    { __typename: 'RegistrationPolicyBucket' }
    & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'description' | 'not_counted' | 'slots_limited' | 'anything' | 'minimum_slots' | 'total_slots'>
  )> }
);

export type EventPageQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type EventPageQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule' | 'can_update_event' | 'can_read_event_signups'>
  ), convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & CommonConventionDataFragment
  )>, myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'private_signup_list' | 'my_rating' | 'can_play_concurrently' | 'form_response_attrs_json_with_rendered_markdown'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'team_member_name'>
    ), form?: Types.Maybe<(
      { __typename: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'public_description'>
          & CommonFormItemFieldsFragment
        )> }
        & CommonFormSectionFieldsFragment
      )> }
      & CommonFormFieldsFragment
    )>, team_members: Array<(
      { __typename: 'TeamMember' }
      & Pick<Types.TeamMember, 'id' | 'email' | 'display_team_member'>
      & { user_con_profile: (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'gravatar_enabled' | 'gravatar_url'>
      ) }
    )>, registration_policy?: Types.Maybe<(
      { __typename: 'RegistrationPolicy' }
      & RunCardRegistrationPolicyFieldsFragment
    )>, runs: Array<(
      { __typename: 'Run' }
      & Pick<Types.Run, 'id'>
      & EventPageRunFieldsFragment
    )> }
  ) }
);

export type CreateModeratedSignupModalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateModeratedSignupModalQueryData = (
  { __typename: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { signups: Array<(
      { __typename: 'Signup' }
      & Pick<Types.Signup, 'id' | 'state'>
      & { run: (
        { __typename: 'Run' }
        & Pick<Types.Run, 'id' | 'starts_at'>
        & { event: (
          { __typename: 'Event' }
          & Pick<Types.Event, 'id' | 'title' | 'length_seconds' | 'can_play_concurrently'>
        ) }
      ) }
    )> }
  )> }
);

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
    title
    length_seconds
    private_signup_list
    my_rating
    can_play_concurrently
    form_response_attrs_json_with_rendered_markdown
    event_category {
      id
      team_member_name
    }
    form {
      id
      ...CommonFormFields
      form_sections {
        id
        ...CommonFormSectionFields
        form_items {
          id
          public_description
          ...CommonFormItemFields
        }
      }
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
}
    ${CommonConventionDataFragmentDoc}
${CommonFormFieldsFragmentDoc}
${CommonFormSectionFieldsFragmentDoc}
${CommonFormItemFieldsFragmentDoc}
${RunCardRegistrationPolicyFieldsFragmentDoc}
${EventPageRunFieldsFragmentDoc}`;

/**
 * __useEventPageQuery__
 *
 * To run a query within a React component, call `useEventPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventPageQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useEventPageQuery(baseOptions: Apollo.QueryHookOptions<EventPageQueryData, EventPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventPageQueryData, EventPageQueryVariables>(EventPageQueryDocument, options);
      }
export function useEventPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventPageQueryData, EventPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventPageQueryData, EventPageQueryVariables>(EventPageQueryDocument, options);
        }
export type EventPageQueryHookResult = ReturnType<typeof useEventPageQuery>;
export type EventPageQueryLazyQueryHookResult = ReturnType<typeof useEventPageQueryLazyQuery>;
export type EventPageQueryQueryResult = Apollo.QueryResult<EventPageQueryData, EventPageQueryVariables>;
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
 * __useCreateModeratedSignupModalQuery__
 *
 * To run a query within a React component, call `useCreateModeratedSignupModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateModeratedSignupModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateModeratedSignupModalQuery({
 *   variables: {
 *   },
 * });
 */
export function useCreateModeratedSignupModalQuery(baseOptions?: Apollo.QueryHookOptions<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>(CreateModeratedSignupModalQueryDocument, options);
      }
export function useCreateModeratedSignupModalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>(CreateModeratedSignupModalQueryDocument, options);
        }
export type CreateModeratedSignupModalQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQuery>;
export type CreateModeratedSignupModalQueryLazyQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQueryLazyQuery>;
export type CreateModeratedSignupModalQueryQueryResult = Apollo.QueryResult<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>;