class MaximumEventProvidedTicketsOverride < ApplicationRecord
  belongs_to :event
  belongs_to :ticket_type

  validates :ticket_type_id, uniqueness: { scope: :event_id }
  validates :override_value, presence: true
end
