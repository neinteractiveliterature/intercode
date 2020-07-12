class CmsFile < ApplicationRecord
  include CadmusFiles::File

  has_and_belongs_to_many :pages
  belongs_to :uploader, class_name: 'User', optional: true
  mount_uploader :file, CmsFileUploader

  cadmus_file :file
  validate :validate_file_name_is_unique

  def rename_file(filename)
    new_path = File.join(File.dirname(file.path), filename)

    if EnvironmentBasedUploader.use_fog?
      resource = Aws::S3::Resource.new
      bucket = resource.bucket(CmsFileUploader.fog_directory)
      object = bucket.object(file.path)
      object.move_to(bucket: bucket_name, key: new_path)
    else
      File.rename(file.path, new_path)
    end

    update_column('file', filename)
    reload
  end
end
