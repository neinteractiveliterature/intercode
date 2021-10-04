import { gql } from '@apollo/client';
import { EventProposalFields } from './queries';

export const CreateEventProposal = gql`
  mutation CreateEventProposal($cloneEventProposalId: ID, $eventCategoryId: ID!) {
    createEventProposal(
      input: { transitionalCloneEventProposalId: $cloneEventProposalId, transitionalEventCategoryId: $eventCategoryId }
    ) {
      event_proposal {
        id: transitionalId
      }
    }
  }
`;

export const UpdateEventProposal = gql`
  mutation UpdateEventProposal($input: UpdateEventProposalInput!) {
    updateEventProposal(input: $input) {
      event_proposal {
        id: transitionalId
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const DeleteEventProposal = gql`
  mutation DeleteEventProposal($id: Int!) {
    deleteEventProposal(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export const SubmitEventProposal = gql`
  mutation SubmitEventProposal($input: SubmitEventProposalInput!) {
    submitEventProposal(input: $input) {
      event_proposal {
        id: transitionalId
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const TransitionEventProposal = gql`
  mutation TransitionEventProposal($eventProposalId: Int!, $status: String!, $dropEvent: Boolean) {
    transitionEventProposal(
      input: { id: $eventProposalId, status: $status, drop_event: $dropEvent }
    ) {
      event_proposal {
        id: transitionalId
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;

export const UpdateEventProposalAdminNotes = gql`
  mutation UpdateEventProposalAdminNotes($eventProposalId: Int!, $adminNotes: String!) {
    updateEventProposalAdminNotes(input: { id: $eventProposalId, admin_notes: $adminNotes }) {
      event_proposal {
        id: transitionalId
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFields}
`;
