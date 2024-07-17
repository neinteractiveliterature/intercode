# frozen_string_literal: true
class Types::CmsFileType < Types::BaseObject
  field :current_ability_can_delete, Boolean, null: false
  field :file, Types::ActiveStorageAttachmentType, null: false
  field :id, ID, null: false

  def file
    dataloader.with(Sources::ActiveStorageAttachment, CmsFile, :file).load(object)
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, CmsFile, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
