# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: maximum_event_provided_tickets_overrides
#
#  id             :bigint           not null, primary key
#  override_value :integer          not null
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

FactoryBot.define do
  factory :maximum_event_provided_tickets_override do
    association :event
    override_value { 42 }

    after(:build) do |mepto|
      mepto.ticket_type ||= build(:event_provided_ticket_type, convention: mepto.event.convention)
    end
  end
end
