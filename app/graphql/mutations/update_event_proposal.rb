# frozen_string_literal: true
class Mutations::UpdateEventProposal < Mutations::BaseMutation
  description "Update an event proposal"

  field :event_proposal, Types::EventProposalType, null: false, description: "The updated event proposal"

  argument :event_proposal,
           Types::EventProposalInputType,
           required: true,
           camelize: false,
           description: "The event proposal attributes to update"
  argument :id, ID, required: false, description: "The ID of the event proposal to update"

  load_and_authorize_convention_associated_model :event_proposals, :id, :update

  def resolve(**args)
    event_proposal_attrs = args[:event_proposal].to_h.stringify_keys
    form_response_attrs = JSON.parse(event_proposal_attrs.delete("form_response_attrs_json"))
    registration_policy_attributes = form_response_attrs.delete("registration_policy")

    changes = apply_registration_policy(event_proposal, registration_policy_attributes)
    changes.update(apply_form_response_attrs(event_proposal, form_response_attrs))
    event_proposal.assign_attributes(event_proposal_attrs)
    event_proposal.save!

    log_form_response_changes(event_proposal, changes) if event_proposal.status != "draft"

    { event_proposal: }
  end

  private

  def apply_registration_policy(event_proposal, registration_policy_attributes)
    change = event_proposal.registration_policy_change_for(registration_policy_attributes)
    return {} unless change

    ActiveRecord::Base.transaction do
      if event_proposal.registration_policy
        event_proposal.registration_policy.update_from!(change.new_policy)
      else
        event_proposal.registration_policy = change.new_policy
        event_proposal.save!
      end
    end

    { "registration_policy" => [change.old_json, event_proposal.registration_policy.as_json] }
  end

  def apply_form_response_attrs(event_proposal, form_response_attrs)
    event_proposal.assign_form_response_attributes(
      event_proposal.filter_form_response_attributes_for_assignment(
        form_response_attrs,
        event_proposal.event_category.event_proposal_form.form_items,
        context[:pundit_user]
      )
    )
    event_proposal.form_response_attribute_changes
  end

  def log_form_response_changes(event_proposal, changes)
    changes.each do |(key, (previous_value, new_value))|
      FormResponseChange.create!(
        response: event_proposal,
        user_con_profile:,
        field_identifier: key,
        previous_value:,
        new_value:
      )
    end
  end
end
