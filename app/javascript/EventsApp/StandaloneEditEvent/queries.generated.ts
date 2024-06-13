/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type StandaloneEditEvent_TicketTypeFieldsFragment = { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number };

export type StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } };

export type StandaloneEditEvent_EventFieldsFragment = { __typename: 'Event', id: string, title?: string | null, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }> };

export type StandaloneEditEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
}>;


export type StandaloneEditEventQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', id: string, ticket_name: string, event_mailing_list_domain?: string | null, name: string, starts_at?: string | null, ends_at?: string | null, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, site_mode: Types.SiteMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_mode: Types.TicketMode, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number }>, event: { __typename: 'Event', id: string, title?: string | null, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, byte_size: number, content_type: string, filename: string, url: string }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: string, override_value: number, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, maximum_event_provided_tickets: number } }> }, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, default_value?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }> } };

export const StandaloneEditEvent_TicketTypeFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_TicketTypeFields on TicketType {
  id
  description
  maximum_event_provided_tickets
}
    `;
export const StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    id
    ...StandaloneEditEvent_TicketTypeFields
  }
  id
  override_value
}
    ${StandaloneEditEvent_TicketTypeFieldsFragmentDoc}`;
export const StandaloneEditEvent_EventFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_EventFields on Event {
  id
  title
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  images {
    id
    byte_size
    content_type
    filename
    url
  }
  event_category {
    id
    name
    event_form {
      id
      ...CommonFormFields
    }
  }
  maximum_event_provided_tickets_overrides {
    id
    ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
  }
}
    ${CommonFormFieldsFragmentDoc}
${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export const StandaloneEditEventQueryDocument = gql`
    query StandaloneEditEventQuery($eventId: ID!) {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_update_event(eventId: $eventId)
  }
  convention: conventionByRequestHost {
    id
    ...CommonConventionData
    ticket_types {
      id
      ...StandaloneEditEvent_TicketTypeFields
    }
    event(id: $eventId) {
      id
      ...StandaloneEditEvent_EventFields
    }
    ticket_name
    event_mailing_list_domain
  }
}
    ${CommonConventionDataFragmentDoc}
${StandaloneEditEvent_TicketTypeFieldsFragmentDoc}
${StandaloneEditEvent_EventFieldsFragmentDoc}`;

/**
 * __useStandaloneEditEventQuery__
 *
 * To run a query within a React component, call `useStandaloneEditEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useStandaloneEditEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStandaloneEditEventQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useStandaloneEditEventQuery(baseOptions: Apollo.QueryHookOptions<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables> & ({ variables: StandaloneEditEventQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>(StandaloneEditEventQueryDocument, options);
      }
export function useStandaloneEditEventQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>(StandaloneEditEventQueryDocument, options);
        }
export function useStandaloneEditEventQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>(StandaloneEditEventQueryDocument, options);
        }
export type StandaloneEditEventQueryHookResult = ReturnType<typeof useStandaloneEditEventQuery>;
export type StandaloneEditEventQueryLazyQueryHookResult = ReturnType<typeof useStandaloneEditEventQueryLazyQuery>;
export type StandaloneEditEventQuerySuspenseQueryHookResult = ReturnType<typeof useStandaloneEditEventQuerySuspenseQuery>;
export type StandaloneEditEventQueryQueryResult = Apollo.QueryResult<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>;