# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: staff_positions
#
#  id            :bigint           not null, primary key
#  cc_addresses  :text             default([]), not null, is an Array
#  email         :text
#  email_aliases :text             default([]), not null, is an Array
#  name          :text
#  visible       :boolean
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_staff_positions_on_convention_id  (convention_id)
#  index_staff_positions_on_visible        (visible)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
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
