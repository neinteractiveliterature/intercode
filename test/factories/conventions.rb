# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :convention do
    name "TestCon"
    domain "testcon.example.com"
    signups_allowed "yes"
    show_schedule "yes"
    news "MyText"
    con_com_meetings "MyText"
    accepting_bids false
    precon_bids_allowed false
    updated_by nil
  end
end
