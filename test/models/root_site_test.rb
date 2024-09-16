# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: root_sites
#
#  id                :bigint           not null, primary key
#  disable_captcha   :boolean          default(FALSE), not null
#  site_name         :text
#  default_layout_id :bigint
#  root_page_id      :bigint
#
# Indexes
#
#  index_root_sites_on_default_layout_id  (default_layout_id)
#  index_root_sites_on_root_page_id       (root_page_id)
#
# Foreign Keys
#
#  fk_rails_...  (default_layout_id => cms_layouts.id)
#  fk_rails_...  (root_page_id => pages.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class RootSiteTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
