# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :organization_permission, class: Permission do
    association :organization_role
    permission { 'manage_organization_access' }
  end

  factory :event_category_permission, class: Permission do
    association :staff_position
    association :model, factory: :event_category
    permission { 'update_events' }
  end
end
