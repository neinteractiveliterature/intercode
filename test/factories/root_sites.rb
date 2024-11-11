# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: root_sites
#
#  id                   :bigint           not null, primary key
#  cms_content_set_name :text             not null
#  disable_captcha      :boolean          default(FALSE), not null
#  site_name            :text
#  default_layout_id    :bigint
#  root_page_id         :bigint
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
FactoryBot.define do
  factory :root_site do
    site_name { "The Root Site" }
    association :root_page, factory: :page
    association :default_layout, factory: :cms_layout
  end
end
