# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :signup do
    run
    user_con_profile
    state { 'confirmed' }
    counted { true }
    updated_by { nil }

    after(:build) do |signup|
      signup.bucket_key ||= signup.run.event.registration_policy.buckets.first.key
    end
  end
end
