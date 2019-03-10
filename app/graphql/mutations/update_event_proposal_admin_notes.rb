class Mutations::UpdateEventProposalAdminNotes < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :admin_notes, String, required: true, camelize: false

  def resolve(id:, admin_notes:)
    event_proposal = context[:convention].event_proposals.find(id)
    event_proposal.update!(admin_notes: admin_notes)

    { event_proposal: event_proposal }
  end
end
