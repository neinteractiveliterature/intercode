class Types::CmsContentGroupType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :contents, [Types::CmsContentType], null: false
  field :permissions, [Types::PermissionType], null: false

  def contents
    object.cms_content_group_associations.includes(:content).map(&:content)
  end
end
