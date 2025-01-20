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

require "test_helper"

class CmsContentGroupTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
