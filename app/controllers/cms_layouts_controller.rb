class CmsLayoutsController < ApplicationController
  include Cadmus::LayoutsController

  authorize_resource
  layout 'cms_admin'

  def parent_model
    convention
  end

  protected

  def cms_layout_params
    params.require(:cms_layout).permit(:name, :content, :navbar_classes, :admin_notes)
  end
end
