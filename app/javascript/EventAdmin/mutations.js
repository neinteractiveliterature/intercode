import gql from 'graphql-tag';
import { fragments } from './eventsQuery';

export const createEventMutation = gql`
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const createFillerEventMutation = gql`
mutation CreateFillerEvent($input: CreateFillerEventInput!) {
  createFillerEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const dropEventMutation = gql`
mutation DropEvent($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
`;

export const restoreDroppedEventMutation = gql`
mutation RestoreDroppedEvent($input: RestoreDroppedEventInput!) {
  restoreDroppedEvent(input: $input) {
    event {
      id
      status
    }
  }
}
`;

export const updateEventMutation = gql`
mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const createRunMutation = gql`
mutation CreateRun($input: CreateRunInput!) {
  createRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const createMultipleRunsMutation = gql`
mutation CreateMultipleRuns($input: CreateMultipleRunsInput!) {
  createMultipleRuns(input: $input) {
    runs {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const updateRunMutation = gql`
mutation UpdateRun($input: UpdateRunInput!) {
  updateRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const deleteRunMutation = gql`
mutation DeleteRun($input: DeleteRunInput!) {
  deleteRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const createMaximumEventProvidedTicketsOverrideMutation = gql`
mutation CreateMaximumEventProvidedTicketsOverride($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
  createMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${fragments.maximumEventProvidedTicketsOverride}
`;

export const deleteMaximumEventProvidedTicketsOverrideMutation = gql`
mutation DeleteMaximumEventProvidedTicketsOverride($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
  deleteMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${fragments.maximumEventProvidedTicketsOverride}
`;

export const updateMaximumEventProvidedTicketsOverrideMutation = gql`
mutation UpdateMaximumEventProvidedTicketsOverride($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
  updateMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}

${fragments.maximumEventProvidedTicketsOverride}
`;

export const updateEventAdminNotesMutation = gql`
mutation UpdateEventAdminNotes($eventId: Int!, $adminNotes: String!) {
  updateEventAdminNotes(input: { id: $eventId, admin_notes: $adminNotes }) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;
