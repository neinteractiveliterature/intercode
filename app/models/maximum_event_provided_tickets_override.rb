# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: maximum_event_provided_tickets_overrides
#
#  id             :bigint           not null, primary key
#  override_value :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  event_id       :bigint
#  ticket_type_id :bigint
#
# Indexes
#
#  idx_max_event_provided_tickets_on_event_id        (event_id)
#  idx_max_event_provided_tickets_on_ticket_type_id  (ticket_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (ticket_type_id => ticket_types.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class MaximumEventProvidedTicketsOverride < ApplicationRecord
  belongs_to :event
  belongs_to :ticket_type

  validates :ticket_type_id, uniqueness: { scope: :event_id }
  validates :override_value, presence: true
end
