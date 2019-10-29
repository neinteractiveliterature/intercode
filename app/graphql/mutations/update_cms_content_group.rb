class Mutations::UpdateCmsContentGroup < Mutations::BaseMutation
  include CmsContentGroupMutation

  field :cms_content_group, Types::CmsContentGroupType, null: false
  argument :id, Integer, required: true
  argument :cms_content_group, Types::CmsContentGroupInputType, required: true, camelize: false
  argument :grant_permissions, [Types::PermissionInputType], required: false, camelize: false
  argument :revoke_permissions, [Types::PermissionInputType], required: false, camelize: false

  authorize_create_cms_model :cms_content_groups

  def resolve(id:, cms_content_group:, grant_permissions: [], revoke_permissions: [])
    content_group = cms_parent.cms_content_groups.find(id)
    content_group.update!(name: cms_content_group.name)
    update_cms_contents(content_group, cms_content_group.contents)

    Types::PermissionInputType.load_permission_input_roles(grant_permissions || []).each do |input|
      Permission.grant(input[:role], content_group, input[:permission])
    end

    Types::PermissionInputType.load_permission_input_roles(revoke_permissions || []).each do |input|
      Permission.revoke(input[:role], content_group, input[:permission])
    end

    { cms_content_group: content_group }
  end
end
