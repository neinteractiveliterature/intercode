# frozen_string_literal: true
class Types::CmsFileType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :filename, String, null: false
  field :url, String, null: false
  field :content_type, String, null: false
  field :size, Int, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsFile, [:parent]).load([pundit_user, :destroy, object.id])
  end

  %i[url content_type size].each do |file_field|
    define_method file_field do
      object.file.public_send(file_field)
    end
  end
end
