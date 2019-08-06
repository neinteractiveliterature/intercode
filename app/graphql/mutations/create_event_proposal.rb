class Mutations::CreateEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :event_category_id, Int, required: true, camelize: false
  argument :clone_event_proposal_id, Int, required: false, camelize: false

  authorize_create_convention_associated_model :event_proposals

  def resolve(event_category_id:, clone_event_proposal_id: nil)
    unless context[:convention].accepting_proposals
      raise "#{convention.name} is not currently accepting event proposals."
    end

    event_category = context[:convention].event_categories.find(event_category_id)
    unless event_category.event_proposal_form
      raise "#{event_category.name} is not a proposable event category"
    end

    event_proposal = context[:convention].event_proposals.new
    event_proposal.assign_attributes(
      owner: context[:user_con_profile],
      status: 'draft',
      event_category: event_category
    )
    event_proposal.assign_default_values_from_form_items(
      event_proposal.event_category.event_proposal_form.form_items
    )

    clone_attributes_from_event_proposal_id(clone_event_proposal_id, event_proposal)
    event_proposal.save!

    { event_proposal: event_proposal }
  end

  def clone_attributes_from_event_proposal_id(id, event_proposal)
    return unless id

    template_proposal = find_template_proposal(id)
    clone_attributes = template_proposal.read_form_response_attributes_for_form_items(
      event_proposal.event_category.event_proposal_form.form_items
    ).except('event_email')
    event_proposal.assign_form_response_attributes(clone_attributes)
  end

  def find_template_proposal(id)
    proposal = EventProposal.find(id)
    Pundit.authorize(pundit_user, proposal, :read?)
    proposal
  end
end
