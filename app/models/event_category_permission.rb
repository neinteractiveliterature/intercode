class EventCategoryPermission < ApplicationRecord
  belongs_to :event_category
  belongs_to :staff_position
end
