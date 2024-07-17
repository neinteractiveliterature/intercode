# frozen_string_literal: true
class Mutations::DeleteCmsContentGroup < Mutations::BaseMutation
  field :cms_content_group, Types::CmsContentGroupType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_content_groups, :id, :destroy

  def resolve(**_args)
    cms_content_group.destroy!
    { cms_content_group: }
  end
end
