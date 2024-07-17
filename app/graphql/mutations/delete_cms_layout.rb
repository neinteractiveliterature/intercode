# frozen_string_literal: true
class Mutations::DeleteCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_layouts, :id, :destroy

  def resolve(**_args)
    cms_layout.destroy!
    { cms_layout: }
  end
end
