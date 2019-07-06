FactoryBot.define do
  factory :organization_role do
    sequence(:name) { |n| "Organization role #{n}" }
    association :organization
  end
end
