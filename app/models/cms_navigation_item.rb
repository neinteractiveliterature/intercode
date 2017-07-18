class CmsNavigationItem < ApplicationRecord
  include CadmusNavbar::NavigationItem
  cadmus_navigation_item
end
