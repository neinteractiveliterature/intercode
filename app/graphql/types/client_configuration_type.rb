class Types::ClientConfigurationType < Types::BaseObject
  field :rails_default_active_storage_service_name, String, null: false
  field :rails_direct_uploads_url, String, null: false
  field :recaptcha_site_key, String, null: false

  def rails_default_active_storage_service_name
    Rails.application.config.active_storage.service.to_s
  end

  def rails_direct_uploads_url
    context[:controller].rails_direct_uploads_url
  end

  def recaptcha_site_key
    Recaptcha.configuration.site_key
  end
end
