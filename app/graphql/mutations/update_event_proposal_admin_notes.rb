# frozen_string_literal: true
class Mutations::UpdateEventProposalAdminNotes < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :admin_notes, String, required: true, camelize: false
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :update_admin_notes

  def resolve(**args)
    event_proposal.update!(admin_notes: args[:admin_notes])

    { event_proposal: }
  end
end
