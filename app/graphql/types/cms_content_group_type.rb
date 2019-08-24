class Types::CmsContentGroupType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :contents, [Types::CmsContentType], null: false
  field :permissions, [Types::PermissionType], null: false
end
