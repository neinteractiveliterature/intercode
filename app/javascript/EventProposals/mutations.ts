import { gql } from '@apollo/client';
import { EventProposalFields } from './queries';

export const CreateEventProposal = gql`
  mutation CreateEventProposal($cloneEventProposalId: ID, $eventCategoryId: ID!) {
    createEventProposal(
      input: { transitionalCloneEventProposalId: $cloneEventProposalId, transitionalEventCategoryId: $eventCategoryId }
    ) {
      event_proposal {
        id
      }
    }
  }
`;

export const UpdateEventProposal = gql`
  mutation UpdateEventProposal($input: UpdateEventProposalInput!) {
    updateEventProposal(input: $input) {
      event_proposal {
        id
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const DeleteEventProposal = gql`
  mutation DeleteEventProposal($id: ID!) {
    deleteEventProposal(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;

export const SubmitEventProposal = gql`
  mutation SubmitEventProposal($input: SubmitEventProposalInput!) {
    submitEventProposal(input: $input) {
      event_proposal {
        id
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const TransitionEventProposal = gql`
  mutation TransitionEventProposal($eventProposalId: ID!, $status: String!, $dropEvent: Boolean) {
    transitionEventProposal(input: { transitionalId: $eventProposalId, status: $status, drop_event: $dropEvent }) {
      event_proposal {
        id
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const UpdateEventProposalAdminNotes = gql`
  mutation UpdateEventProposalAdminNotes($eventProposalId: ID!, $adminNotes: String!) {
    updateEventProposalAdminNotes(input: { transitionalId: $eventProposalId, admin_notes: $adminNotes }) {
      event_proposal {
        id
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;
