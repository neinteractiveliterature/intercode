module EnvironmentBasedUploader
  extend ActiveSupport::Concern

  def self.use_fog?
    fog_environment? && missing_keys_for_fog.none?
  end

  def self.fog_environment?
    Rails.env.production? || Rails.env.stage?
  end

  def self.missing_keys_for_fog
    %w[AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_S3_BUCKET].select do |required_key|
      ENV[required_key].blank?
    end
  end

  included do
    if EnvironmentBasedUploader.use_fog?
      storage :fog
    else
      storage :file
    end
  end
end
