# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :signup_request do
    association :target_run, factory: :run
    state { 'pending' }

    after(:build) do |signup_request|
      signup_request.user_con_profile ||= FactoryBot.create(
        :user_con_profile, convention: signup_request.target_run.event.convention
      )
      signup_request.updated_by ||= signup_request.user_con_profile.user
      signup_request.requested_bucket_key ||= (
        signup_request.target_run.event.registration_policy.buckets.first.key
      )
    end
  end
end
