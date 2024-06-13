# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_content_group_associations
#
#  id                   :bigint           not null, primary key
#  content_type         :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  cms_content_group_id :bigint           not null
#  content_id           :bigint           not null
#
# Indexes
#
#  index_cms_content_group_associations_on_cms_content_group_id  (cms_content_group_id)
#  index_cms_content_group_associations_on_content               (content_type,content_id)
#
# Foreign Keys
#
#  fk_rails_...  (cms_content_group_id => cms_content_groups.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class CmsContentGroupAssociationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
