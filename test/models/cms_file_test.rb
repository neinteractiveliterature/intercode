# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_files
#
#  id          :integer          not null, primary key
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#  uploader_id :bigint
#
# Indexes
#
#  index_cms_files_on_parent_id    (parent_id)
#  index_cms_files_on_uploader_id  (uploader_id)
#
# Foreign Keys
#
#  fk_rails_...  (uploader_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require 'test_helper'

class CmsFileTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
