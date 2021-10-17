import { gql } from '@apollo/client';
import {
  StandaloneEditEvent_EventFields,
  StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields,
} from './queries';

export const StandaloneDropEvent = gql`
  mutation StandaloneDropEvent($input: DropEventInput!) {
    dropEvent(input: $input) {
      event {
        id: transitionalId
        status
      }
    }
  }
`;

export const StandaloneUpdateEvent = gql`
  mutation StandaloneUpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      event {
        id: transitionalId
        ...StandaloneEditEvent_EventFields
      }
    }
  }

  ${StandaloneEditEvent_EventFields}
`;

export const StandaloneCreateMaximumEventProvidedTicketsOverride = gql`
  mutation StandaloneCreateMaximumEventProvidedTicketsOverride(
    $input: CreateMaximumEventProvidedTicketsOverrideInput!
  ) {
    createMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields}
`;

export const StandaloneDeleteMaximumEventProvidedTicketsOverride = gql`
  mutation StandaloneDeleteMaximumEventProvidedTicketsOverride(
    $input: DeleteMaximumEventProvidedTicketsOverrideInput!
  ) {
    deleteMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields}
`;

export const StandaloneUpdateMaximumEventProvidedTicketsOverride = gql`
  mutation StandaloneUpdateMaximumEventProvidedTicketsOverride(
    $input: UpdateMaximumEventProvidedTicketsOverrideInput!
  ) {
    updateMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${StandaloneEditEvent_MaximumEventProvidedTicketsOverrideFields}
`;
