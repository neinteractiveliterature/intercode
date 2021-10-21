# frozen_string_literal: true
class Mutations::DeleteCmsContentGroup < Mutations::BaseMutation
  field :cms_content_group, Types::CmsContentGroupType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_content_groups, :id, :destroy

  def resolve(**_args)
    cms_content_group.destroy!
    { cms_content_group: cms_content_group }
  end
end
