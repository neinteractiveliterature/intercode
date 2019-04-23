class Mutations::UpdateCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id, Integer, required: true
  argument :cms_layout, Types::CmsLayoutInputType, required: true, camelize: false

  def resolve(**args)
    cms_layout = cms_parent.cms_layouts.find(args[:id])
    cms_layout.update!(args[:cms_layout].to_h)

    { cms_layout: cms_layout }
  end
end
