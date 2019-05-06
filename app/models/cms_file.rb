class CmsFile < ApplicationRecord
  include CadmusFiles::File

  belongs_to :uploader, class_name: 'User', optional: true
  mount_uploader :file, CmsFileUploader

  cadmus_file :file
  has_one_attached :file_activestorage
  validate :validate_file_name_is_unique
end
