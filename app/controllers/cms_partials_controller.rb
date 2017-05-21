class CmsPartialsController < BaseControllers::VirtualHost
  include Cadmus::PartialsController

  authorize_resource :cms_partial

  def parent_model
    convention
  end
end
