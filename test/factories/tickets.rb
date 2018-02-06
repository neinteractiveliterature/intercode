# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :ticket do
    user_con_profile
    payment_amount_cents 1
    payment_amount_currency 'USD'
    payment_note 'MyText'

    after(:build) do |ticket|
      ticket.ticket_type ||= FactoryBot.create(:free_ticket_type, convention: ticket.user_con_profile.convention)
    end
  end
end
