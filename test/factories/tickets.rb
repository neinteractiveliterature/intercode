# Read about factories at https://github.com/thoughtbot/factory_bot

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
