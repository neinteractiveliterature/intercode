class CmsFilesController < ApplicationController
  include CadmusFiles::AdminController

  authorize_resource :cms_navigation_items

  layout 'cms_admin'

  def parent_model
    convention
  end

  private

  def cms_file_params
    super.merge(uploader: current_user)
  end
end
