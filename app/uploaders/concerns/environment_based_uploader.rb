module Concerns::EnvironmentBasedUploader
  extend ActiveSupport::Concern

  def self.use_fog?
    Rails.env.production? || Rails.env.stage?
  end

  included do
    if Concerns::EnvironmentBasedUploader.use_fog?
      storage :fog
    else
      storage :file
    end
  end
end
