/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MySignupFieldsFragment = { __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string };

export type MySignupRequestFieldsFragment = { __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined };

export type EventPageRunFieldsFragment = { __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> };

export type RunCardRegistrationPolicyFieldsFragment = { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null | undefined, total_slots?: number | null | undefined }> };

export type EventPageQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID'];
}>;


export type EventPageQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_update_event: boolean, can_read_event_signups: boolean }, convention: { __typename: 'Convention', name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, my_profile?: { __typename: 'UserConProfile', id: string } | null | undefined, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, private_signup_list?: boolean | null | undefined, my_rating?: number | null | undefined, can_play_concurrently: boolean, form_response_attrs_json_with_rendered_markdown?: any | null | undefined, id: string, event_category: { __typename: 'EventCategory', team_member_name: string, id: string }, form?: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', public_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } | null | undefined, team_members: Array<{ __typename: 'TeamMember', email?: string | null | undefined, display_team_member: boolean, id: string, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, gravatar_enabled: boolean, gravatar_url: string, id: string } }>, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null | undefined, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null | undefined, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null | undefined, description?: string | null | undefined, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null | undefined, total_slots?: number | null | undefined }> } | null | undefined, runs: Array<{ __typename: 'Run', title_suffix?: string | null | undefined, starts_at: any, current_ability_can_signup_summary_run: boolean, signup_count_by_state_and_bucket_key_and_counted: any, id: string, rooms: Array<{ __typename: 'Room', name?: string | null | undefined, id: string }>, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, waitlist_position?: number | null | undefined, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, requested_bucket_key?: string | null | undefined, id: string, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null | undefined }> }> }, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> } };

export type CreateModeratedSignupModalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateModeratedSignupModalQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, my_profile?: { __typename: 'UserConProfile', id: string, signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string, run: { __typename: 'Run', starts_at: any, id: string, event: { __typename: 'Event', title?: string | null | undefined, length_seconds: number, can_play_concurrently: boolean, id: string } } }> } | null | undefined } };

export const MySignupFieldsFragmentDoc = gql`
    fragment MySignupFields on Signup {
  id: transitionalId
  state
  waitlist_position
}
    `;
export const MySignupRequestFieldsFragmentDoc = gql`
    fragment MySignupRequestFields on SignupRequest {
  id: transitionalId
  state
  target_run {
    id: transitionalId
  }
  requested_bucket_key
  replace_signup {
    id: transitionalId
  }
}
    `;
export const EventPageRunFieldsFragmentDoc = gql`
    fragment EventPageRunFields on Run {
  id: transitionalId
  title_suffix
  starts_at
  current_ability_can_signup_summary_run
  signup_count_by_state_and_bucket_key_and_counted
  rooms {
    id: transitionalId
    name
  }
  my_signups {
    id: transitionalId
    ...MySignupFields
  }
  my_signup_requests {
    id: transitionalId
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
    query EventPageQuery($eventId: ID!) {
  __typename
  currentAbility {
    can_read_schedule
    can_update_event(transitionalEventId: $eventId)
    can_read_event_signups(transitionalEventId: $eventId)
  }
  convention: conventionByRequestHost {
    id: transitionalId
    ...CommonConventionData
    my_profile {
      id: transitionalId
    }
    event(transitionalId: $eventId) {
      id: transitionalId
      title
      length_seconds
      private_signup_list
      my_rating
      can_play_concurrently
      form_response_attrs_json_with_rendered_markdown
      event_category {
        id: transitionalId
        team_member_name
      }
      form {
        id: transitionalId
        ...CommonFormFields
        form_sections {
          id: transitionalId
          ...CommonFormSectionFields
          form_items {
            id: transitionalId
            public_description
            ...CommonFormItemFields
          }
        }
      }
      team_members {
        id: transitionalId
        email
        display_team_member
        user_con_profile {
          id: transitionalId
          name_without_nickname
          gravatar_enabled
          gravatar_url
        }
      }
      registration_policy {
        ...RunCardRegistrationPolicyFields
      }
      runs {
        id: transitionalId
        ...EventPageRunFields
      }
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
  convention: conventionByRequestHost {
    id: transitionalId
    my_profile {
      id: transitionalId
      signups {
        id: transitionalId
        state
        run {
          id: transitionalId
          starts_at
          event {
            id: transitionalId
            title
            length_seconds
            can_play_concurrently
          }
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