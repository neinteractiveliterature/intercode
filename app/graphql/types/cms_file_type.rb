# frozen_string_literal: true
class Types::CmsFileType < Types::BaseObject
  DEPRECATION_REASON =
    'File attachment fields are migrating to ActiveStorage.  Please use the subfields under `file` instead.'

  field :id, ID, null: false
  field :filename, String, null: false, deprecation_reason: DEPRECATION_REASON
  field :url, String, null: false, deprecation_reason: DEPRECATION_REASON
  field :content_type, String, null: false, deprecation_reason: DEPRECATION_REASON
  field :size, Int, null: false, deprecation_reason: DEPRECATION_REASON
  field :current_ability_can_delete, Boolean, null: false
  field :file, Types::ActiveStorageAttachmentType, null: false

  def file
    ActiveStorageAttachmentLoader.for(CmsFile, :file).load(object)
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsFile, [:parent]).load([pundit_user, :destroy, object.id])
  end

  def url
    context[:controller].cdn_upload_url(object.file)
  end

  def content_type
    object.file.content_type
  end

  def size
    object.file.byte_size
  end
end
