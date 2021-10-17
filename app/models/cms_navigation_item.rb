# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_navigation_items
#
#  id                    :bigint           not null, primary key
#  parent_type           :string
#  position              :integer
#  title                 :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  navigation_section_id :bigint
#  page_id               :bigint
#  parent_id             :bigint
#
# Indexes
#
#  index_cms_navigation_items_on_navigation_section_id      (navigation_section_id)
#  index_cms_navigation_items_on_page_id                    (page_id)
#  index_cms_navigation_items_on_parent_type_and_parent_id  (parent_type,parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (navigation_section_id => cms_navigation_items.id)
#  fk_rails_...  (page_id => pages.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CmsNavigationItem < ApplicationRecord
  include CadmusNavbar::NavigationItem
  cadmus_navigation_item

  after_commit :touch_parent

  private

  def touch_parent
    parent.touch if parent&.persisted?
  end
end
