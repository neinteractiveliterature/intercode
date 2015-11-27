# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :ticket do
    user_con_profile nil
    ticket_type nil
    payment_amount_cents 1
    payment_amount_currency "MyString"
    payment_note "MyText"
  end
end
