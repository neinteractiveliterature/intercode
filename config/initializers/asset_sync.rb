AssetSync.configure do |config|
  config.fog_provider = 'AWS'
  config.fog_directory = ENV['ASSET_SYNC_FOG_DIRECTORY']
  config.aws_access_key_id = ENV['AWS_ACCESS_KEY_ID']
  config.aws_secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
  config.aws_iam_roles = true
end
