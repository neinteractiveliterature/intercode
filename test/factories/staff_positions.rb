FactoryBot.define do
  factory :staff_position do
    convention
    name { 'Wrangler' }
  end

  factory :admin_staff_position, class: StaffPosition do
    convention
    name { 'Chief Wrangler' }
    after(:create) do |staff_position|
      Permission.grant(
        staff_position,
        staff_position.convention,
        *Permission.permission_names_for_model_type('Convention')
      )
    end
  end
end
