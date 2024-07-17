# frozen_string_literal: true
class Mutations::CreateCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :cms_layout, Types::CmsLayoutInputType, required: true, camelize: false

  authorize_create_cms_model :cms_layouts

  def resolve(**args)
    cms_layout = cms_parent.cms_layouts.create!(args[:cms_layout].to_h)

    { cms_layout: }
  end
end
