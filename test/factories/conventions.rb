# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :convention do
    name { 'TestCon' }
    sequence(:domain) { |n| "testcon#{n}.example.com" }
    timezone_name { 'US/Eastern' }
    show_schedule { 'yes' }
    show_event_list { 'yes' }
    accepting_proposals { false }
    updated_by { nil }
    maximum_event_signups do
      ScheduledValue::ScheduledValue.new(
        timespans: [
          {
            start: nil,
            finish: nil,
            value: 'unlimited'
          }
        ]
      )
    end
    starts_at { Time.new(2016, 10, 28, 18, 0, 0) }
    ends_at { Time.new(2016, 10, 30, 18, 0, 0) }
    stripe_publishable_key { "pk_test_#{Devise.friendly_token}" }
    stripe_secret_key { "sk_test_#{Devise.friendly_token}" }

    after(:build) do |convention|
      convention.user_con_profile_form ||= convention.build_user_con_profile_form(form_type: 'user_con_profile')
    end

    trait :with_notification_templates do
      after(:create) do |convention|
        content_set = CmsContentSet.new(name: 'standard')
        CmsContentLoaders::CmsPartials.new(convention: convention, content_set: content_set).call!
        CmsContentLoaders::NotificationTemplates.new(
          convention: convention, content_set: content_set
        ).call!
      end
    end

    trait :with_standard_content do
      after(:create) do |convention|
        convention.forms.destroy_all
        convention.update!(user_con_profile_form: nil)
        LoadCmsContentSetService.new(convention: convention, content_set_name: 'standard').call!
      end
    end
  end
end
