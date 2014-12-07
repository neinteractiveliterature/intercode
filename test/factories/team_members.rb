# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :team_member do
    event ""
    user ""
    updated_at "2014-01-12 15:56:37"
    updated_by_id 1
    display false
    show_email false
    receive_con_email false
    receive_signup_email false
  end
end
