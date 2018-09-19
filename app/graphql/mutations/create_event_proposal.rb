module Mutations
  class CreateEventProposal < GraphQL::Schema::RelayClassicMutation
    field :event_proposal, Types::EventProposalType, null: false, camelize: false

    argument :clone_event_proposal_id, Int, required: false, camelize: false

    def resolve(clone_event_proposal_id: nil)
      form_items = context[:convention].event_proposal_form.form_items
      event_proposal = context[:convention].event_proposals.new
      event_proposal.assign_attributes(owner: context[:user_con_profile], status: 'draft')
      event_proposal.assign_default_values_from_form_items(form_items)

      if clone_event_proposal_id
        template_proposal = find_template_proposal(clone_event_proposal_id)
        event_proposal.assign_form_response_attributes(
          template_proposal.read_form_response_attributes_for_form_items(form_items)
        )
      end
      event_proposal.save!

      { event_proposal: event_proposal }
    end

    def find_template_proposal(id)
      proposal = EventProposal.find(id)
      context[:current_ability].authorize! :read, proposal
      proposal
    end
  end
end
