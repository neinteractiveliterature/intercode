# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :con do
    signups_allowed "MyString"
    show_schedule "MyString"
    news "MyText"
    con_com_meetings "MyText"
    accepting_bids false
    precon_bids_allowed false
    updated_by nil
  end
end
