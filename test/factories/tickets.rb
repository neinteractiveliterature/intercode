# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: tickets
#
#  id                   :integer          not null, primary key
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  event_id             :bigint
#  order_entry_id       :bigint
#  provided_by_event_id :integer
#  ticket_type_id       :integer
#  user_con_profile_id  :integer
#
# Indexes
#
#  index_tickets_on_event_id              (event_id)
#  index_tickets_on_order_entry_id        (order_entry_id)
#  index_tickets_on_provided_by_event_id  (provided_by_event_id)
#  index_tickets_on_ticket_type_id        (ticket_type_id)
#  index_tickets_on_user_con_profile_id   (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (order_entry_id => order_entries.id)
#  fk_rails_...  (provided_by_event_id => events.id)
#  fk_rails_...  (ticket_type_id => ticket_types.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :ticket do
    user_con_profile

    after(:build) do |ticket|
      unless ticket.ticket_type
        ticket.ticket_type = create(:free_ticket_type, convention: ticket.user_con_profile.convention)
        ticket.user_con_profile.convention.ticket_types.reload # to get the validation to work
      end
    end
  end
end
