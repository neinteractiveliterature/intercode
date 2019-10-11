class Mutations::CreateCmsContentGroup < Mutations::BaseMutation
  include CmsContentGroupMutation

  field :cms_content_group, Types::CmsContentGroupType, null: false
  argument :cms_content_group, Types::CmsContentGroupInputType, required: true, camelize: false
  argument :permissions, [Types::PermissionInputType], required: false

  authorize_create_cms_model :cms_content_groups

  def resolve(cms_content_group:, permissions: [])
    content_group = cms_parent.cms_content_groups.create!(name: cms_content_group[:name])
    update_cms_contents(content_group, cms_content_group[:contents])

    Types::PermissionInputType.load_permission_input_roles(permissions || []).each do |input|
      Permission.grant(input[:role], content_group, input[:permission])
    end

    { cms_content_group: content_group }
  end
end
