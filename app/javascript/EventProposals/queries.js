import gql from 'graphql-tag';

const fragments = {};

fragments.eventProposal = gql`
fragment EventProposalFields on EventProposal {
  id
  form_response_attrs_json
}
`;

fragments.eventProposalFormData = gql`
fragment EventProposalFormData on Convention {
  starts_at
  ends_at
  timezone_name

  event_proposal_form {
    form_api_json
  }
}
`;

export const eventProposalQuery = gql`
query($eventProposalId: Int!) {
  convention {
    ...EventProposalFormData
  }

  eventProposal(id: $eventProposalId) {
    ...EventProposalFields
  }
}

${fragments.eventProposal}
${fragments.eventProposalFormData}
`;

export { fragments };
