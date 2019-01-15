class CmsNavigationItem < ApplicationRecord
  include CadmusNavbar::NavigationItem
  cadmus_navigation_item

  after_commit :touch_parent

  private

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
