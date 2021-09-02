/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MySignupFieldsFragment = { __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> };

export type MySignupRequestFieldsFragment = { __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> };

export type EventPageRunFieldsFragment = { __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> }> };

export type RunCardRegistrationPolicyFieldsFragment = { __typename: 'RegistrationPolicy', slots_limited?: Types.Maybe<boolean>, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: Types.Maybe<number>, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: Types.Maybe<string>, description?: Types.Maybe<string>, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: Types.Maybe<number>, total_slots?: Types.Maybe<number> }> };

export type EventPageQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type EventPageQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_update_event: boolean, can_read_event_signups: boolean }, convention?: Types.Maybe<{ __typename: 'Convention', id: number, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, site_mode: Types.SiteMode, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: Types.Maybe<string>, full_color?: Types.Maybe<string>, signed_up_color?: Types.Maybe<string> }> }>, myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number }>, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, private_signup_list?: Types.Maybe<boolean>, my_rating?: Types.Maybe<number>, can_play_concurrently: boolean, form_response_attrs_json_with_rendered_markdown?: Types.Maybe<any>, event_category: { __typename: 'EventCategory', id: number, team_member_name: string }, form?: Types.Maybe<{ __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position?: Types.Maybe<number>, form_items: Array<{ __typename: 'FormItem', id: number, public_description?: Types.Maybe<string>, position?: Types.Maybe<number>, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> }>, team_members: Array<{ __typename: 'TeamMember', id: number, email?: Types.Maybe<string>, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string, gravatar_enabled: boolean, gravatar_url: string } }>, registration_policy?: Types.Maybe<{ __typename: 'RegistrationPolicy', slots_limited?: Types.Maybe<boolean>, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: Types.Maybe<number>, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: Types.Maybe<string>, description?: Types.Maybe<string>, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: Types.Maybe<number>, total_slots?: Types.Maybe<number> }> }>, runs: Array<{ __typename: 'Run', id: number, title_suffix?: Types.Maybe<string>, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, rooms: Array<{ __typename: 'Room', id: number, name?: Types.Maybe<string> }>, my_signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, waitlist_position?: Types.Maybe<number> }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: number, state: Types.SignupRequestState, requested_bucket_key?: Types.Maybe<string>, target_run: { __typename: 'Run', id: number }, replace_signup?: Types.Maybe<{ __typename: 'Signup', id: number }> }> }> } };

export type CreateModeratedSignupModalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateModeratedSignupModalQueryData = { __typename: 'Query', myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, signups: Array<{ __typename: 'Signup', id: number, state: Types.SignupState, run: { __typename: 'Run', id: number, starts_at: any, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, length_seconds: number, can_play_concurrently: boolean } } }> }> };

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