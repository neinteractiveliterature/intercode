# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :run do
    event

    after(:build) do |run|
      run.starts_at = run.event.convention.starts_at
    end
  end
end
