# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :convention do
    signups_allowed 'no'
    show_schedule 'no'
    news 'MyText'
    con_com_meetings 'MyText'
    accepting_bids false
    precon_bids_allowed false
    updated_by nil
  end
end
