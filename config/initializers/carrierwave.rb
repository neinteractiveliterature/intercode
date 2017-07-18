CarrierWave.configure do |config|
  if Concerns::EnvironmentBasedUploader.use_fog?
    config.fog_credentials = {
      :provider               => 'AWS',
      :aws_access_key_id      => ENV['AWS_ACCESS_KEY_ID'],
      :aws_secret_access_key  => ENV['AWS_SECRET_ACCESS_KEY'],
      :region                 => ENV['AWS_S3_REGION'] || 'us-east-1'
    }

    config.fog_directory  = ENV['AWS_S3_BUCKET']
  end
end