class MaximumEventProvidedTicketsOverride < ApplicationRecord
  belongs_to :event
  belongs_to :ticket_type

  validates_uniqueness_of :ticket_type_id, scope: :event_id
  validates :override_value, presence: true
end
