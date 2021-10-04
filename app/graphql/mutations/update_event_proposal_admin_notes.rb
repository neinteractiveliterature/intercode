# frozen_string_literal: true
class Mutations::UpdateEventProposalAdminNotes < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :admin_notes, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :update_admin_notes

  def resolve(**args)
    event_proposal.update!(admin_notes: args[:admin_notes])

    { event_proposal: event_proposal }
  end
end
