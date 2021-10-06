/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';
import { CommonFormFields } from '../../Models/commonFormFragments';

export const StandaloneEditEvent_TicketTypeFields = gql`
  fragment StandaloneEditEvent_TicketTypeFields on TicketType {
    id: transitionalId
    description
    maximum_event_provided_tickets
  }
`;

export const StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields = gql`
  fragment StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
    ticket_type {
      id: transitionalId
      ...StandaloneEditEvent_TicketTypeFields
    }

    id: transitionalId
    override_value
  }

  ${StandaloneEditEvent_TicketTypeFields}
`;

export const StandaloneEditEvent_EventFields = gql`
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

  ${CommonFormFields}
  ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields}
`;

export const StandaloneEditEventQuery = gql`
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

  ${CommonConventionData}
  ${StandaloneEditEvent_TicketTypeFields}
  ${StandaloneEditEvent_EventFields}
`;
