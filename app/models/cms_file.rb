class CmsFile < ApplicationRecord
  include CadmusFiles::File

  has_and_belongs_to_many :pages
  belongs_to :uploader, class_name: 'User', optional: true
  mount_uploader :file, CmsFileUploader

  cadmus_file :file
  validate :validate_file_name_is_unique
end
