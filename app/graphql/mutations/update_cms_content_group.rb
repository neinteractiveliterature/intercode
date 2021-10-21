# frozen_string_literal: true
class Mutations::UpdateCmsContentGroup < Mutations::BaseMutation
  include CmsContentGroupMutation

  field :cms_content_group, Types::CmsContentGroupType, null: false
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :cms_content_group, Types::CmsContentGroupInputType, required: true, camelize: false
  argument :grant_permissions, [Types::PermissionInputType], required: false, camelize: false
  argument :revoke_permissions, [Types::PermissionInputType], required: false, camelize: false

  authorize_create_cms_model :cms_content_groups

  def resolve(cms_content_group:, id: nil, transitional_id: nil, grant_permissions: [], revoke_permissions: [])
    content_group = cms_parent.cms_content_groups.find(transitional_id || id)
    content_group.update!(name: cms_content_group.name)
    update_cms_contents(content_group, cms_content_group.contents)

    Types::PermissionInputType
      .load_permission_input_roles(grant_permissions || [])
      .each { |input| Permission.grant(input[:role], content_group, input[:permission]) }

    Types::PermissionInputType
      .load_permission_input_roles(revoke_permissions || [])
      .each { |input| Permission.revoke(input[:role], content_group, input[:permission]) }

    { cms_content_group: content_group }
  end
end
