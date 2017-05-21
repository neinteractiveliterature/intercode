class CmsFilesController < BaseControllers::VirtualHost
  include CadmusFiles::AdminController

  load_and_authorize_resource through: :convention

  private
  def cms_file_scope
    convention.cms_files
  end

  def cms_file_params
    super.merge(uploader: current_user)
  end
end
