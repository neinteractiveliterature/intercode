class Types::EventCategoryPermissionType < Types::BaseObject
  field :id, Int, null: false
  field :event_category, Types::EventCategoryType, null: false, camelize: false
  field :staff_position, Types::StaffPositionType, null: false, camelize: false
  field :can_read_event_proposals, Boolean, null: false, camelize: false
  field :can_read_pending_event_proposals, Boolean, null: false, camelize: false
  field :can_update_event_proposals, Boolean, null: false, camelize: false
  field :can_access_admin_notes, Boolean, null: false, camelize: false
  field :can_override_event_tickets, Boolean, null: false, camelize: false
  field :can_update_events, Boolean, null: false, camelize: false

  association_loaders :event_category, :staff_position
end
