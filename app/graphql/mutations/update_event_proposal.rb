# frozen_string_literal: true
class Mutations::UpdateEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :event_proposal, Types::EventProposalInputType, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :update

  # rubocop:disable Metrics/MethodLength
  def resolve(**args)
    event_proposal_attrs = args[:event_proposal].to_h.stringify_keys
    event_proposal.assign_form_response_attributes(
      event_proposal.filter_form_response_attributes_for_assignment(
        JSON.parse(event_proposal_attrs.delete('form_response_attrs_json')),
        event_proposal.event_category.event_proposal_form.form_items,
        context[:pundit_user]
      )
    )
    event_proposal.assign_attributes(event_proposal_attrs)
    event_proposal.save!

    if event_proposal.status != 'draft'
      event_proposal.form_response_attribute_changes.each do |(key, (previous_value, new_value))|
        FormResponseChange.create!(
          response: event_proposal,
          user_con_profile:,
          field_identifier: key,
          previous_value:,
          new_value:
        )
      end
    end

    { event_proposal: }
  end
  # rubocop:enable Metrics/MethodLength
end
