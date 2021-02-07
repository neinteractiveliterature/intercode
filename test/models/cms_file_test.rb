# == Schema Information
#
# Table name: cms_files
#
#  id          :integer          not null, primary key
#  file        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#  uploader_id :integer
#
# Indexes
#
#  index_cms_files_on_parent_id           (parent_id)
#  index_cms_files_on_parent_id_and_file  (parent_id,file) UNIQUE
#  index_cms_files_on_uploader_id         (uploader_id)
#
# Foreign Keys
#
#  fk_rails_...  (uploader_id => users.id)
#
require 'test_helper'

class CmsFileTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
