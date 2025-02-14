# frozen_string_literal: true
class Mutations::CreateCmsPartial < Mutations::BaseMutation
  description "Creates a new CMS partial"

  field :cms_partial, Types::CmsPartialType, null: false do
    description "The partial that was just created"
  end

  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false do
    description "The attributes for the partial to create"
  end
  argument :partial_block_name, Types::CmsPartialBlockName, required: false, camelize: false do
    description "If present, uses the given CmsPartialBlockName to as the name rather than the one given in cms_partial"
  end

  authorize_create_cms_model :cms_partials

  def resolve(partial_block_name: nil, **args)
    attributes = args[:cms_partial].to_h.with_indifferent_access
    attributes[:name] = partial_block_name if partial_block_name

    cms_partial = cms_parent.cms_partials.create!(attributes)

    { cms_partial: }
  end
end
