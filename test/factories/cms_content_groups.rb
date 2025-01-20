# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_content_groups
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_content_groups_on_parent_type_and_parent_id  (parent_type,parent_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :cms_content_group do
    sequence(:name) { |n| "content_group_#{n}" }
    association :parent, factory: :convention
  end
end
