# frozen_string_literal: true
class Mutations::UpdateEventAdminNotes < Mutations::BaseMutation
  field :event, Types::EventType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :admin_notes, String, required: true, camelize: false

  load_and_authorize_convention_associated_model :events, :id, :update_admin_notes

  def resolve(**args)
    event.update!(admin_notes: args[:admin_notes])
    { event: event }
  end
end
