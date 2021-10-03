# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_files
#
#  id          :integer          not null, primary key
#  file        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#  uploader_id :integer
#
# Indexes
#
#  index_cms_files_on_parent_id           (parent_id)
#  index_cms_files_on_parent_id_and_file  (parent_id,file) UNIQUE
#  index_cms_files_on_uploader_id         (uploader_id)
#
# Foreign Keys
#
#  fk_rails_...  (uploader_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
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
      object.move_to({ bucket: bucket.name, key: new_path }, { acl: 'public-read' })
    else
      File.rename(file.path, new_path)
    end

    update_column('file', filename)
    reload
  end
end
