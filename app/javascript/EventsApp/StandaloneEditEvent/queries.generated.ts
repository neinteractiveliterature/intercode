/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StandaloneEditEvent_TicketTypeFieldsFragment = { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string };

export type StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } };

export type StandaloneEditEvent_EventFieldsFragment = { __typename: 'Event', title?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, id: string, event_category: { __typename: 'EventCategory', name: string, id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } }> };

export type StandaloneEditEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID'];
}>;


export type StandaloneEditEventQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_delete_event: boolean, can_update_event: boolean }, convention: { __typename: 'Convention', ticket_name: string, event_mailing_list_domain?: string | null | undefined, name: string, starts_at?: any | null | undefined, ends_at?: any | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_mode: Types.TicketMode, id: string, ticket_types: Array<{ __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string }>, event: { __typename: 'Event', title?: string | null | undefined, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, id: string, event_category: { __typename: 'EventCategory', name: string, id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', override_value: number, id: string, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, maximum_event_provided_tickets: number, id: string } }> }, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> } };

export const StandaloneEditEvent_TicketTypeFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_TicketTypeFields on TicketType {
  id: transitionalId
  description
  maximum_event_provided_tickets
}
    `;
export const StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    id: transitionalId
    ...StandaloneEditEvent_TicketTypeFields
  }
  id: transitionalId
  override_value
}
    ${StandaloneEditEvent_TicketTypeFieldsFragmentDoc}`;
export const StandaloneEditEvent_EventFieldsFragmentDoc = gql`
    fragment StandaloneEditEvent_EventFields on Event {
  id: transitionalId
  title
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  event_category {
    id: transitionalId
    name
    event_form {
      id: transitionalId
      ...CommonFormFields
    }
  }
  maximum_event_provided_tickets_overrides {
    id: transitionalId
    ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
  }
}
    ${CommonFormFieldsFragmentDoc}
${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export const StandaloneEditEventQueryDocument = gql`
    query StandaloneEditEventQuery($eventId: ID!) {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_delete_event(transitionalEventId: $eventId)
    can_update_event(transitionalEventId: $eventId)
  }
  convention: conventionByRequestHost {
    id: transitionalId
    ...CommonConventionData
    ticket_types {
      id: transitionalId
      ...StandaloneEditEvent_TicketTypeFields
    }
    event(transitionalId: $eventId) {
      id: transitionalId
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
export function useStandaloneEditEventQuery(baseOptions: Apollo.QueryHookOptions<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>(StandaloneEditEventQueryDocument, options);
      }
export function useStandaloneEditEventQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>(StandaloneEditEventQueryDocument, options);
        }
export type StandaloneEditEventQueryHookResult = ReturnType<typeof useStandaloneEditEventQuery>;
export type StandaloneEditEventQueryLazyQueryHookResult = ReturnType<typeof useStandaloneEditEventQueryLazyQuery>;
export type StandaloneEditEventQueryQueryResult = Apollo.QueryResult<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>;