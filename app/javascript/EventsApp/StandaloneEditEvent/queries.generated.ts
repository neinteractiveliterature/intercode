/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../../Models/commonFormFragments.generated';
import { CommonConventionDataFragment } from '../queries.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import { CommonConventionDataFragmentDoc } from '../queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type StandaloneEditEvent_TicketTypeFieldsFragment = (
  { __typename: 'TicketType' }
  & Pick<Types.TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>
);

export type StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment = (
  { __typename: 'MaximumEventProvidedTicketsOverride' }
  & Pick<Types.MaximumEventProvidedTicketsOverride, 'id' | 'override_value'>
  & { ticket_type: (
    { __typename: 'TicketType' }
    & Pick<Types.TicketType, 'id'>
    & StandaloneEditEvent_TicketTypeFieldsFragment
  ) }
);

export type StandaloneEditEvent_EventFieldsFragment = (
  { __typename: 'Event' }
  & Pick<Types.Event, 'id' | 'title' | 'form_response_attrs_json' | 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>
  & { event_category: (
    { __typename: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
    & { event_form: (
      { __typename: 'Form' }
      & Pick<Types.Form, 'id'>
      & CommonFormFieldsFragment
    ) }
  ), maximum_event_provided_tickets_overrides: Array<(
    { __typename: 'MaximumEventProvidedTicketsOverride' }
    & Pick<Types.MaximumEventProvidedTicketsOverride, 'id'>
    & StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFieldsFragment
  )> }
);

export type StandaloneEditEventQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type StandaloneEditEventQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_override_maximum_event_provided_tickets' | 'can_delete_event' | 'can_update_event'>
  ), convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name' | 'event_mailing_list_domain'>
    & { ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
      & StandaloneEditEvent_TicketTypeFieldsFragment
    )> }
    & CommonConventionDataFragment
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id'>
    & StandaloneEditEvent_EventFieldsFragment
  ) }
);

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