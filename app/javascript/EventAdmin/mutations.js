import gql from 'graphql-tag';
import { fragments } from './eventsQuery';

export const createEventMutation = gql`
mutation($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const createFillerEventMutation = gql`
mutation($input: CreateFillerEventInput!) {
  createFillerEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const dropEventMutation = gql`
mutation($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
`;

export const restoreDroppedEventMutation = gql`
mutation($input: RestoreDroppedEventInput!) {
  restoreDroppedEvent(input: $input) {
    event {
      id
      status
    }
  }
}
`;

export const updateEventMutation = gql`
mutation($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const createVolunteerEventMutation = gql`
mutation($input: CreateVolunteerEventInput!) {
  createVolunteerEvent(input: $input) {
    event {
      ...EventFields
    }
  }
}

${fragments.event}
`;

export const createRunMutation = gql`
mutation($input: CreateRunInput!) {
  createRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const createMultipleRunsMutation = gql`
mutation($input: CreateMultipleRunsInput!) {
  createMultipleRuns(input: $input) {
    runs {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const updateRunMutation = gql`
mutation($input: UpdateRunInput!) {
  updateRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;

export const deleteRunMutation = gql`
mutation($input: DeleteRunInput!) {
  deleteRun(input: $input) {
    run {
      ...RunFields
    }
  }
}

${fragments.run}
`;
