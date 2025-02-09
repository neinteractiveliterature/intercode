# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: pages
#
#  id                       :bigint           not null, primary key
#  admin_notes              :text
#  content                  :text
#  hidden_from_search       :boolean          default(FALSE), not null
#  invariant                :boolean          default(FALSE), not null
#  meta_description         :text
#  name                     :text
#  parent_type              :string
#  skip_clickwrap_agreement :boolean          default(FALSE), not null
#  slug                     :string
#  created_at               :datetime
#  updated_at               :datetime
#  cms_layout_id            :bigint
#  parent_id                :bigint
#
# Indexes
#
#  index_pages_on_cms_layout_id                       (cms_layout_id)
#  index_pages_on_parent_type_and_parent_id_and_slug  (parent_type,parent_id,slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (cms_layout_id => cms_layouts.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class PageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
