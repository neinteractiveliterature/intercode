import gql from 'graphql-tag';
import { fragments } from './queries';

export const updateEventProposalMutation = gql`
mutation UpdateEventProposal($input: UpdateEventProposalInput!) {
  updateEventProposal(input: $input) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;

export const submitEventProposalMutation = gql`
mutation SubmitEventProposal($input: SubmitEventProposalInput!) {
  submitEventProposal(input: $input) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;

export const transitionEventProposalMutation = gql`
mutation TransitionEventProposal($eventProposalId: Int!, $status: String!) {
  transitionEventProposal(input: { id: $eventProposalId, status: $status}) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;

export const updateEventProposalAdminNotesMutation = gql`
mutation UpdateEventProposalAdminNotes($eventProposalId: Int!, $adminNotes: String!) {
  updateEventProposalAdminNotes(input: { id: $eventProposalId, admin_notes: $adminNotes }) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;
