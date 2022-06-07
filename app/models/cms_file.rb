# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_files
#
#  id          :integer          not null, primary key
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#  uploader_id :bigint
#
# Indexes
#
#  index_cms_files_on_parent_id    (parent_id)
#  index_cms_files_on_uploader_id  (uploader_id)
#
# Foreign Keys
#
#  fk_rails_...  (uploader_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CmsFile < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent

  model_with_parent
  has_and_belongs_to_many :pages
  belongs_to :uploader, class_name: 'User', optional: true
  has_one_attached :file

  validate :validate_file_name_is_unique

  def to_param
    "#{id}-#{file.filename.to_param}"
  end

  def rename_file(filename)
    file.blob.update!(filename: filename)
  end

  def validate_file_name_is_unique
    the_filename = file.filename.to_s

    scope = parent ? CmsFile.where(parent: parent) : CmsFile.global
    duplicates =
      ActiveStorage::Attachment
        .where(record: scope)
        .joins(:blob)
        .where.not(record_id: id)
        .where('lower(active_storage_blobs.filename) = ?', the_filename.downcase)
    errors.add file_field, "'#{the_filename}' already exists" if duplicates.any?
  end
end
