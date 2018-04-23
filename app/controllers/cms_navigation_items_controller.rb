class CmsNavigationItemsController < ApplicationController
  authorize_resource :cms_navigation_items

  layout 'cms_admin'

  def index
  end
end
