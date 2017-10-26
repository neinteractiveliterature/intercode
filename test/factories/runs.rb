# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :run do
    event

    after(:build) do |run|
      run.starts_at = run.event.convention.starts_at
    end
  end
end
