# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :convention do
    name "TestCon"
    sequence(:domain) { |n| "testcon#{n}.example.com" }
    timezone_name "US/Eastern"
    signups_allowed "yes"
    show_schedule "yes"
    news "MyText"
    con_com_meetings "MyText"
    accepting_bids false
    precon_bids_allowed false
    updated_by nil
    maximum_event_signups ScheduledValue.new(
      timespans: [
        {
          start: nil,
          finish: nil,
          value: 'unlimited'
        }
      ]
    )
    starts_at Time.new(2016, 10, 28, 18, 0, 0)
    ends_at Time.new(2016, 10, 30, 18, 0, 0)
  end
end
