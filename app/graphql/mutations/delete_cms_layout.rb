class Mutations::DeleteCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id, Integer, required: true

  load_and_authorize_cms_model :cms_layouts, :id, :destroy

  def resolve(**_args)
    cms_layout.destroy!
    { cms_layout: cms_layout }
  end
end
