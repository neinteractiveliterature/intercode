# frozen_string_literal: true
class Mutations::UpdateEventAdminNotes < Mutations::BaseMutation
  field :event, Types::EventType, null: false, camelize: false

  argument :id, ID, required: false
  argument :admin_notes, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :events, :id, :update_admin_notes

  def resolve(**args)
    event.update!(admin_notes: args[:admin_notes])
    { event: event }
  end
end
