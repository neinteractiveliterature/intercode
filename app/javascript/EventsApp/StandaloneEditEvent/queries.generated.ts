/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StandaloneEditEvent_TicketTypeFieldsFragment = { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, maximum_event_provided_tickets: number };

export type StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment = { __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, maximum_event_provided_tickets: number } };

export type StandaloneEditEvent_EventFieldsFragment = { __typename: 'Event', id: number, title?: Types.Maybe<string>, form_response_attrs_json?: Types.Maybe<any>, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, event_category: { __typename: 'EventCategory', id: number, name: string, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, maximum_event_provided_tickets: number } }> };

export type StandaloneEditEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type StandaloneEditEventQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_override_maximum_event_provided_tickets: boolean, can_delete_event: boolean, can_update_event: boolean }, convention?: Types.Maybe<{ __typename: 'Convention', id: number, ticket_name: string, event_mailing_list_domain?: Types.Maybe<string>, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, site_mode: Types.SiteMode, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, ticket_mode: Types.TicketMode, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string>, maximum_event_provided_tickets: number }>, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string, scheduling_ui: Types.SchedulingUi, default_color?: Types.Maybe<string>, full_color?: Types.Maybe<string>, signed_up_color?: Types.Maybe<string> }> }>, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, form_response_attrs_json?: Types.Maybe<any>, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, event_category: { __typename: 'EventCategory', id: number, name: string, event_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }, maximum_event_provided_tickets_overrides: Array<{ __typename: 'MaximumEventProvidedTicketsOverride', id: number, override_value: number, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, maximum_event_provided_tickets: number } }> } };

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
    query StandaloneEditEventQuery($eventId: Int!) {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_delete_event(event_id: $eventId)
    can_update_event(event_id: $eventId)
  }
  convention {
    id
    ...CommonConventionData
    ticket_types {
      id
      ...StandaloneEditEvent_TicketTypeFields
    }
    ticket_name
    event_mailing_list_domain
  }
  event(id: $eventId) {
    id
    ...StandaloneEditEvent_EventFields
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