class CmsPartialsController < BaseControllers::VirtualHost
  include Cadmus::PartialsController

  authorize_resource :cms_partial
  layout 'cms_admin'

  def parent_model
    convention
  end
end
