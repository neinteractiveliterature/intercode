class Mutations::DeleteCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    cms_layout = convention.cms_layouts.find(args[:id])
    cms_layout.destroy!
    { cms_layout: cms_layout }
  end
end
