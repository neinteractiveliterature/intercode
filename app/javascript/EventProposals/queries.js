import gql from 'graphql-tag';

const fragments = {};

fragments.eventProposal = gql`
fragment EventProposalFields on EventProposal {
  id
  title
  status
  form_response_attrs_json

  event {
    id
  }
}
`;

fragments.eventProposalFormData = gql`
fragment EventProposalFormData on Convention {
  starts_at
  ends_at
  timezone_name
  event_mailing_list_domain

  event_proposal_form {
    form_api_json
  }
}
`;

export const eventProposalQuery = gql`
query($eventProposalId: Int!) {
  convention {
    id
    ...EventProposalFormData
  }

  eventProposal(id: $eventProposalId) {
    ...EventProposalFields
  }
}

${fragments.eventProposal}
${fragments.eventProposalFormData}
`;

export const eventProposalQueryWithOwner = gql`
query($eventProposalId: Int!) {
  convention {
    id
    ...EventProposalFormData
  }

  eventProposal(id: $eventProposalId) {
    ...EventProposalFields

    owner {
      id
      name
    }
  }

  myProfile {
    id
    ability {
      can_update_event_proposal(event_proposal_id: $eventProposalId)
      can_read_admin_notes_on_event_proposal(event_proposal_id: $eventProposalId)
    }
  }
}

${fragments.eventProposal}
${fragments.eventProposalFormData}
`;

export const eventProposalAdminNotesQuery = gql`
query($eventProposalId: Int!) {
  eventProposal(id: $eventProposalId) {
    id
    admin_notes
  }
}
`;

export { fragments };
