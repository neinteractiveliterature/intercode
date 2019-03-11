class Mutations::UpdateEventAdminNotes < Mutations::BaseMutation
  field :event, Types::EventType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :admin_notes, String, required: true, camelize: false

  def resolve(id:, admin_notes:)
    event = context[:convention].events.find(id)
    event.update!(admin_notes: admin_notes)

    { event: event }
  end
end
