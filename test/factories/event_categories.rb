# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :event_category do
    sequence(:name) { |n| "Event category #{n}" }
    team_member_name { 'team member' }
    scheduling_ui { 'regular' }
    default_color { '#d4f5fa' }
    full_color { 'rgba(23, 162, 184, 0.7)' }
    signed_up_color { '#17a2b8' }
    convention

    after(:build) do |event_category|
      event_category.event_form ||= event_category.build_event_form(convention: event_category.convention, form_type: 'event')
      event_category.event_proposal_form ||= event_category.build_event_proposal_form(convention: event_category.convention, form_type: 'event_proposal')
    end
  end
end
