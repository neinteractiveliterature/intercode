# frozen_string_literal: true
class Mutations::CreateEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :event_category_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_event_category_id, ID, required: false, camelize: true
  argument :clone_event_proposal_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_clone_event_proposal_id, ID, required: false, camelize: true

  authorize_create_convention_associated_model :event_proposals

  def resolve(
    event_category_id: nil,
    transitional_event_category_id: nil,
    clone_event_proposal_id: nil,
    transitional_clone_event_proposal_id: nil
  )
    unless context[:convention].accepting_proposals
      raise "#{convention.name} is not currently accepting event proposals."
    end

    event_category = context[:convention].event_categories.find(transitional_event_category_id || event_category_id)
    raise "#{event_category.name} is not a proposable event category" unless event_category.event_proposal_form

    event_proposal = context[:convention].event_proposals.new
    event_proposal.assign_attributes(owner: context[:user_con_profile], status: 'draft', event_category: event_category)
    event_proposal.assign_default_values_from_form_items(event_proposal.event_category.event_proposal_form.form_items)

    clone_attributes_from_event_proposal_id(
      transitional_clone_event_proposal_id || clone_event_proposal_id,
      event_proposal
    )
    event_proposal.save!

    { event_proposal: event_proposal }
  end

  def clone_attributes_from_event_proposal_id(id, event_proposal)
    return unless id

    template_proposal = find_template_proposal(id)
    compatible_items =
      compatible_items_from_template(
        template_proposal.event_category.event_proposal_form,
        event_proposal.event_category.event_proposal_form
      )
    clone_attributes = template_proposal.read_form_response_attributes_for_form_items(compatible_items)
    event_proposal.assign_form_response_attributes(clone_attributes)
  end

  def compatible_items_from_template(template_form, proposal_form)
    template_form.form_items.select do |template_item|
      next false if template_item.identifier == 'event_email' # never copy event email

      proposal_form_item = proposal_form.form_items.find { |item| item.identifier == template_item.identifier }
      next false unless proposal_form_item

      proposal_form_item.item_type == template_item.item_type
    end
  end

  def find_template_proposal(id)
    proposal = EventProposal.find(id)
    Pundit.authorize(pundit_user, proposal, :read?)
    proposal
  end
end
