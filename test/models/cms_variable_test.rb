# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_variables
#
#  id          :bigint           not null, primary key
#  key         :string(100)      not null
#  parent_type :string
#  value       :jsonb
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_variables_on_parent_id          (parent_id)
#  index_cms_variables_on_parent_id_and_key  (parent_id,key) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class CmsVariableTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
