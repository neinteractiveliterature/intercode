CarrierWave.configure do |config|
  if EnvironmentBasedUploader.fog_environment?
    missing_keys = EnvironmentBasedUploader.missing_keys_for_fog

    if missing_keys.any?
      Rails.logger.warn <<~TEXT
        Missing configuration for S3.  The following environment variables are needed but not present:
        #{missing_keys.join(", ")}
      TEXT
    else
      config.fog_provider = 'fog/aws'
      config.fog_credentials = {
        provider: 'AWS',
        aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
        region: ENV['AWS_S3_REGION'] || 'us-east-1'
      }

      config.fog_directory = ENV['AWS_S3_BUCKET']
      config.asset_host = ENV['UPLOADS_HOST'] if ENV['UPLOADS_HOST'].present?
    end
  end
end
