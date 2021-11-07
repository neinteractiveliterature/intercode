# frozen_string_literal: true
class Mutations::UpdateEventProposalAdminNotes < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :admin_notes, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :update_admin_notes

  def resolve(**args)
    event_proposal.update!(admin_notes: args[:admin_notes])

    { event_proposal: event_proposal }
  end
end
