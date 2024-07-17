# frozen_string_literal: true
class Mutations::UpdateCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id, ID, required: false
  argument :cms_layout, Types::CmsLayoutInputType, required: true, camelize: false

  load_and_authorize_cms_model :cms_layouts, :id, :update

  def resolve(**args)
    cms_layout.update!(args[:cms_layout].to_h)

    { cms_layout: cms_layout }
  end
end
