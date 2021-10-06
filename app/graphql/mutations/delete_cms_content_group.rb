# frozen_string_literal: true
class Mutations::DeleteCmsContentGroup < Mutations::BaseMutation
  field :cms_content_group, Types::CmsContentGroupType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_cms_model :cms_content_groups, :id, :destroy

  def resolve(**_args)
    cms_content_group.destroy!
    { cms_content_group: cms_content_group }
  end
end
