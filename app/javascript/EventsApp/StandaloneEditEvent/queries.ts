/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';
import { CommonFormFields } from '../../Models/commonFormFragments';

export const StandaloneEditEvent_TicketTypeFields = gql`
  fragment StandaloneEditEvent_TicketTypeFields on TicketType {
    id
    description
    maximum_event_provided_tickets
  }
`;

export const StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields = gql`
  fragment StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
    ticket_type {
      id
      ...StandaloneEditEvent_TicketTypeFields
    }

    id
    override_value
  }

  ${StandaloneEditEvent_TicketTypeFields}
`;

export const StandaloneEditEvent_EventFields = gql`
  fragment StandaloneEditEvent_EventFields on Event {
    id
    title
    form_response_attrs_json
    current_user_form_item_role

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

  ${CommonFormFields}
  ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields}
`;

export const StandaloneEditEventQuery = gql`
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

  ${CommonConventionData}
  ${StandaloneEditEvent_TicketTypeFields}
  ${StandaloneEditEvent_EventFields}
`;
