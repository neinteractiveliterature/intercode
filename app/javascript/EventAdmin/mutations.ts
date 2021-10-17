import { gql } from '@apollo/client';
import { EventFields, RunFields, MaximumEventProvidedTicketsOverrideFields } from './queries';

export const CreateEvent = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      event {
        id: transitionalId
        ...EventFields
      }
    }
  }

  ${EventFields}
`;

export const CreateFillerEvent = gql`
  mutation CreateFillerEvent($input: CreateFillerEventInput!) {
    createFillerEvent(input: $input) {
      event {
        id: transitionalId
        ...EventFields
      }
    }
  }

  ${EventFields}
`;

export const DropEvent = gql`
  mutation DropEvent($input: DropEventInput!) {
    dropEvent(input: $input) {
      event {
        id: transitionalId
        status
      }
    }
  }
`;

export const RestoreDroppedEvent = gql`
  mutation RestoreDroppedEvent($input: RestoreDroppedEventInput!) {
    restoreDroppedEvent(input: $input) {
      event {
        id: transitionalId
        status
      }
    }
  }
`;

export const UpdateEvent = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      event {
        id: transitionalId
        ...EventFields
      }
    }
  }

  ${EventFields}
`;

export const CreateRun = gql`
  mutation CreateRun($input: CreateRunInput!) {
    createRun(input: $input) {
      run {
        id: transitionalId
        ...RunFields
      }
    }
  }

  ${RunFields}
`;

export const CreateMultipleRuns = gql`
  mutation CreateMultipleRuns($input: CreateMultipleRunsInput!) {
    createMultipleRuns(input: $input) {
      runs {
        id: transitionalId
        ...RunFields
      }
    }
  }

  ${RunFields}
`;

export const UpdateRun = gql`
  mutation UpdateRun($input: UpdateRunInput!) {
    updateRun(input: $input) {
      run {
        id: transitionalId
        ...RunFields
      }
    }
  }

  ${RunFields}
`;

export const DeleteRun = gql`
  mutation DeleteRun($input: DeleteRunInput!) {
    deleteRun(input: $input) {
      run {
        id: transitionalId
        ...RunFields
      }
    }
  }

  ${RunFields}
`;

export const CreateMaximumEventProvidedTicketsOverride = gql`
  mutation CreateMaximumEventProvidedTicketsOverride($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
    createMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${MaximumEventProvidedTicketsOverrideFields}
`;

export const DeleteMaximumEventProvidedTicketsOverride = gql`
  mutation DeleteMaximumEventProvidedTicketsOverride($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
    deleteMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${MaximumEventProvidedTicketsOverrideFields}
`;

export const UpdateMaximumEventProvidedTicketsOverride = gql`
  mutation UpdateMaximumEventProvidedTicketsOverride($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
    updateMaximumEventProvidedTicketsOverride(input: $input) {
      maximum_event_provided_tickets_override {
        id: transitionalId
        ...MaximumEventProvidedTicketsOverrideFields
      }
    }
  }

  ${MaximumEventProvidedTicketsOverrideFields}
`;

export const UpdateEventAdminNotes = gql`
  mutation UpdateEventAdminNotes($eventId: ID!, $adminNotes: String!) {
    updateEventAdminNotes(input: { transitionalId: $eventId, admin_notes: $adminNotes }) {
      event {
        id: transitionalId
        ...EventFields
      }
    }
  }

  ${EventFields}
`;
