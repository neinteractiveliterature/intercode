class MaximumEventProvidedTicketsOverride < ApplicationRecord
  belongs_to :event
  belongs_to :ticket_type

  validates :override_value, presence: true
end
