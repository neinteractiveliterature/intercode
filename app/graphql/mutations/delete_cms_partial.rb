class Mutations::DeleteCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    cms_partial = cms_parent.cms_partials.find(args[:id])
    cms_partial.destroy!
    { cms_partial: cms_partial }
  end
end
