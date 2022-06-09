# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_partials
#
#  id          :bigint           not null, primary key
#  admin_notes :text
#  content     :text
#  invariant   :boolean          default(FALSE), not null
#  name        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_partials_on_parent_id_and_parent_type           (parent_id,parent_type)
#  index_cms_partials_on_parent_id_and_parent_type_and_name  (parent_id,parent_type,name) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :cms_partial do
    sequence(:name) { |n| "partial_#{n}" }
    content { 'Some text' }
    association :parent, factory: :convention
  end
end
