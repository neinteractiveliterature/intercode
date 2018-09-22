import gql from 'graphql-tag';
import { fragments } from './queries';

export const updateEventProposalMutation = gql`
mutation($input: UpdateEventProposalInput!) {
  updateEventProposal(input: $input) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;

export const submitEventProposalMutation = gql`
mutation($input: SubmitEventProposalInput!) {
  submitEventProposal(input: $input) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;

export const transitionEventProposalMutation = gql`
mutation($eventProposalId: Int!, $status: String!) {
  transitionEventProposal(input: { id: $eventProposalId, status: $status}) {
    event_proposal {
      ...EventProposalFields
    }
  }
}

${fragments.eventProposal}
`;
