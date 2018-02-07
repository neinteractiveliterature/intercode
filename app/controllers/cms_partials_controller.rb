class CmsPartialsController < ApplicationController
  include Cadmus::PartialsController

  authorize_resource :cms_partial
  layout 'cms_admin'

  def parent_model
    convention
  end

  protected

  def cms_partial_params
    params.require(:cms_partial).permit(cms_partial_class.name_field, :content, :admin_notes)
  end
end
