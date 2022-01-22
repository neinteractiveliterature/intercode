# frozen_string_literal: true
class Types::CmsFileType < Types::BaseObject
  field :id, ID, null: false
  field :current_ability_can_delete, Boolean, null: false
  field :file, Types::ActiveStorageAttachmentType, null: false

  def file
    ActiveStorageAttachmentLoader.for(CmsFile, :file).load(object)
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsFile, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
