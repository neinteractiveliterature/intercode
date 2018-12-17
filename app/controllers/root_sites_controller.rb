class RootSitesController < ApplicationController
  authorize_resource

  layout 'cms_admin'

  def show
  end
end
