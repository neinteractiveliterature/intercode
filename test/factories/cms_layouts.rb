# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_layouts
#
#  id             :bigint           not null, primary key
#  admin_notes    :text
#  content        :text
#  name           :text
#  navbar_classes :text
#  parent_type    :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  parent_id      :bigint
#
# Indexes
#
#  index_cms_layouts_on_parent_type_and_parent_id  (parent_type,parent_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :cms_layout do
    sequence(:name) { |n| "layout_#{n}" }
    content { "Some text" }
    association :parent, factory: :convention
  end
end
