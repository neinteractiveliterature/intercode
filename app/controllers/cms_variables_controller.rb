class CmsVariablesController < ApplicationController
  authorize_resource :cms_variables

  layout 'cms_admin'

  def index
  end
end
