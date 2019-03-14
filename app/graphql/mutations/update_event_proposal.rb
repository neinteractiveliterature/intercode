class Mutations::UpdateEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id, Integer, required: true
  argument :event_proposal, Types::EventProposalInputType, required: true, camelize: false

  def resolve(**args)
    event_proposal = convention.event_proposals.find(args[:id])
    event_proposal_attrs = args[:event_proposal].to_h.stringify_keys
    event_proposal.assign_form_response_attributes(
      JSON.parse(event_proposal_attrs.delete('form_response_attrs_json'))
    )
    event_proposal.assign_attributes(event_proposal_attrs)
    event_proposal.save!

    if event_proposal.status != 'draft'
      event_proposal.form_response_attribute_changes.each do |(key, (previous_value, new_value))|
        FormResponseChange.create!(
          response: event_proposal,
          user_con_profile: user_con_profile,
          field_identifier: key,
          previous_value: previous_value,
          new_value: new_value
        )
      end
    end

    { event_proposal: event_proposal }
  end
end
