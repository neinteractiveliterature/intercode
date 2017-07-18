class CmsNavigationItemsController < BaseControllers::VirtualHost
  include CadmusNavbar::AdminController

  authorize_resource :cms_navigation_items

  private

  def parent_model
    convention
  end

  def navigation_item_scope
    parent_model ? parent_model.cms_navigation_items : super
  end
end
