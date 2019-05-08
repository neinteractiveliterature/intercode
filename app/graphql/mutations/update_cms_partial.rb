class Mutations::UpdateCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :id, Integer, required: true
  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false

  def resolve(**args)
    cms_partial = cms_parent.cms_partials.find(args[:id])
    cms_partial.update!(args[:cms_partial].to_h)

    { cms_partial: cms_partial }
  end
end
