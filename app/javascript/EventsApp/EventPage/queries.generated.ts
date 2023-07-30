/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import { CommonFormItemFieldsFragmentDoc, CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import { PricingStructureFieldsFragmentDoc } from '../../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MySignupFieldsFragment = { __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null };

export type MySignupRequestFieldsFragment = { __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null };

export type EventPageRunFieldsFragment = { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, current_ability_can_signup_summary_run: boolean, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null }> };

export type RunCardRegistrationPolicyFieldsFragment = { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null, total_slots?: number | null }> };

export type EventPageQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
}>;


export type EventPageQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_update_event: boolean, can_read_event_signups: boolean }, convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, signup_mode: Types.SignupMode, site_mode: Types.SiteMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, maximum_event_signups?: { __typename: 'ScheduledValue', timespans: Array<{ __typename: 'TimespanWithValue', start?: string | null, finish?: string | null, value: string }> } | null, my_profile?: { __typename: 'UserConProfile', id: string } | null, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, counted: boolean }>, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, private_signup_list?: boolean | null, my_rating?: number | null, can_play_concurrently: boolean, form_response_attrs_json_with_rendered_markdown?: string | null, event_category: { __typename: 'EventCategory', id: string, team_member_name: string, teamMemberNamePlural: string }, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, description_html?: string | null, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> }>, form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } | null, team_members: Array<{ __typename: 'TeamMember', id: string, email?: string | null, display_team_member: boolean, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, gravatar_enabled: boolean, gravatar_url: string } }>, registration_policy?: { __typename: 'RegistrationPolicy', slots_limited?: boolean | null, prevent_no_preference_signups: boolean, total_slots_including_not_counted?: number | null, buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null, not_counted: boolean, slots_limited: boolean, anything: boolean, minimum_slots?: number | null, total_slots?: number | null }> } | null, runs: Array<{ __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, current_ability_can_signup_summary_run: boolean, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, rooms: Array<{ __typename: 'Room', id: string, name?: string | null }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, waitlist_position?: number | null, expires_at?: string | null }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string }, replace_signup?: { __typename: 'Signup', id: string } | null }> }> }, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, default_value?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }> } };

export type CreateModeratedSignupModalQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateModeratedSignupModalQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, my_profile?: { __typename: 'UserConProfile', id: string, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, run: { __typename: 'Run', id: string, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, can_play_concurrently: boolean } } }> } | null } };

export const MySignupFieldsFragmentDoc = gql`
    fragment MySignupFields on Signup {
  id
  state
  waitlist_position
  expires_at
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
  grouped_signup_counts {
    bucket_key
    count
    counted
    state
    team_member
  }
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
    query EventPageQuery($eventId: ID!) {
  __typename
  currentAbility {
    can_read_schedule
    can_update_event(eventId: $eventId)
    can_read_event_signups(eventId: $eventId)
  }
  convention: conventionByRequestHost {
    id
    ...CommonConventionData
    maximum_event_signups {
      timespans {
        start
        finish
        value
      }
    }
    my_profile {
      id
    }
    my_signups {
      id
      state
      counted
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
        teamMemberNamePlural
      }
      ticket_types {
        id
        description
        providing_products {
          id
          name
          available
          description_html
          pricing_structure {
            ...PricingStructureFields
          }
        }
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
}
    ${CommonConventionDataFragmentDoc}
${PricingStructureFieldsFragmentDoc}
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
export function useEventPageQuery(baseOptions: Apollo.QueryHookOptions<EventPageQueryData, EventPageQueryVariables> & ({ variables: EventPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventPageQueryData, EventPageQueryVariables>(EventPageQueryDocument, options);
      }
export function useEventPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventPageQueryData, EventPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventPageQueryData, EventPageQueryVariables>(EventPageQueryDocument, options);
        }
export function useEventPageQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventPageQueryData, EventPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventPageQueryData, EventPageQueryVariables>(EventPageQueryDocument, options);
        }
export type EventPageQueryHookResult = ReturnType<typeof useEventPageQuery>;
export type EventPageQueryLazyQueryHookResult = ReturnType<typeof useEventPageQueryLazyQuery>;
export type EventPageQuerySuspenseQueryHookResult = ReturnType<typeof useEventPageQuerySuspenseQuery>;
export type EventPageQueryQueryResult = Apollo.QueryResult<EventPageQueryData, EventPageQueryVariables>;
export const CreateModeratedSignupModalQueryDocument = gql`
    query CreateModeratedSignupModalQuery {
  convention: conventionByRequestHost {
    id
    my_profile {
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
export function useCreateModeratedSignupModalQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>(CreateModeratedSignupModalQueryDocument, options);
        }
export type CreateModeratedSignupModalQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQuery>;
export type CreateModeratedSignupModalQueryLazyQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQueryLazyQuery>;
export type CreateModeratedSignupModalQuerySuspenseQueryHookResult = ReturnType<typeof useCreateModeratedSignupModalQuerySuspenseQuery>;
export type CreateModeratedSignupModalQueryQueryResult = Apollo.QueryResult<CreateModeratedSignupModalQueryData, CreateModeratedSignupModalQueryVariables>;